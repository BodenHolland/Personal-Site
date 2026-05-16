import React, { useState, lazy, Suspense } from 'react';

// Webamp (Music app) is lazy-loaded so it only pulls webamp + butterchurn
// into the bundle when the user actually clicks the Music desktop icon.
const Webamp = lazy(() => import('./wmp/Webamp.jsx'));

// ErrorBoundary specifically for the Webamp mount. Without this, if Webamp's
// constructor or render throws (network failure on the .wsz skin, butterchurn
// preset parse error, etc.), React 19 unmounts the entire root → the whole
// page goes white. The boundary catches the error, logs it, and silently
// closes the player so the rest of the site keeps working.
class WebampErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) {
    console.error('[Webamp] crashed:', error, info);
    if (this.props.onError) this.props.onError(error);
  }
  render() {
    if (this.state.error) return null;
    return this.props.children;
  }
}
import { motion, AnimatePresence } from 'framer-motion';
import SunCalc from 'suncalc';
import {
  playMouseDown,
  playMouseUp,
  playKeyboard,
  playPowerOn,
  playPowerOff,
  playMonitorClick,
  playKnobClick,
  playShutdown,
  startAmbient,
  stopAmbient,
  setMasterVolume,
  setMuted as setAudioMuted,
} from './crtAudio';
import { 
  Package, 
  BookOpen, 
  Hammer, 
  Trees, 
  Camera, 
  Mail,
  ExternalLink,
  X,
  Send,
  HeartPulse,
  Smartphone,
  Lightbulb,
  Info,
  FileText,
  ChevronLeft,
  ChevronRight,
  Scale,
  Music,
  Volume2,
  VolumeX,
  Map,
  Users,
  Clock,
  Sunrise,
  SunMedium,
  Sun,
  Sunset,
  Sparkles,
  Moon
} from 'lucide-react';

const PHASE_ORDER = ['dawn', 'day', 'sunset', 'evening'];
const PHASE_META = {
  dawn:     { label: 'Dawn',      Icon: SunMedium },
  day:      { label: 'Day',       Icon: Sun },
  sunset:   { label: 'Sunset',    Icon: Sunset },
  evening:  { label: 'Evening',   Icon: Moon },
};
const getPhaseFromHour = (h) => {
  if (h >= 5 && h < 10) return 'dawn';
  if (h >= 10 && h < 17) return 'day';
  if (h >= 17 && h < 19) return 'sunset';
  return 'evening';
};

const getPhaseFromSuncalc = (lat, lon, date = new Date()) => {
  try {
    const times = SunCalc.getTimes(date, lat, lon);
    const now = date.getTime();
    
    // Fallbacks if some times are missing
    if (!times.dawn || !times.goldenHourEnd || !times.goldenHour || !times.dusk) {
      return getPhaseFromHour(date.getHours());
    }

    if (now >= times.dawn.getTime() && now < times.goldenHourEnd.getTime()) {
      return 'dawn';
    } else if (now >= times.goldenHourEnd.getTime() && now < times.goldenHour.getTime()) {
      return 'day';
    } else if (now >= times.goldenHour.getTime() && now < times.dusk.getTime()) {
      return 'sunset';
    } else {
      return 'evening';
    }
  } catch (e) {
    console.error('Error calculating sun phase:', e);
    return getPhaseFromHour(date.getHours());
  }
};

const NightSky = () => {
  return (
    <div className="night-sky-container">
      <div className="far-off-galaxy"></div>
      <div className="twinkling-stars">
        {[...Array(40)].map((_, i) => (
          <div 
            key={i} 
            className="twinkle-star" 
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      <div className="shooting-stars-layer">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`shooting-star star-${i + 1}`}></div>
        ))}
      </div>
    </div>
  );
};

const SplitText = ({ children }) => {
  if (typeof children !== 'string') return children;
  return children.split(' ').map((word, i, arr) => (
    <React.Fragment key={i}>
      <span className="hover-word">{word}</span>
      {i < arr.length - 1 ? ' ' : ''}
    </React.Fragment>
  ));
};

// Live clock for Win95 taskbar
const Win95Clock = () => {
  const [time, setTime] = React.useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  React.useEffect(() => {
    const tick = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(tick);
  }, []);
  return <div className="win95-clock">{time}</div>;
};
const booksData = [
  {
    title: "Seeing Is Forgetting the Name of the Thing One Sees",
    author: "Lawrence Weschler",
    coverImageUrl: "/book_covers/book1.jpg",
    description: "A fascinating biography of artist Robert Irwin, tracing his journey from abstract expressionist painter to a pioneer of site-specific light and space installations.",
    link: "https://www.ucpress.edu/book/9780520256095/seeing-is-forgetting-the-name-of-the-thing-one-sees",
    highlights: [
      { text: "This romantic conception still characterizes many popular images of the artist—that he is usually the survivor of an unhappy childhood and a pilloried adolescence, that his heightened sensitivity entails a heightened vulnerability, that his psyche dips slightly askew (either tipped toward the melancholic or tottering along the manic-depressive)—and none of it has anything to do with the life and person of Los Angeles artist Robert Irwin, whom you can meet most any afternoon of the week, basking in the sun at his neighborhood falafel stand, palming his perennial Coke, and watching the world go by.", page: 253 },
      { text: "“In terms of just day-to-day life,” he was continuing, “basically I can have a terrific time doing nothing. I’m quite at ease, and always on the plus side. I can come down here and sit on the corner, and, I mean, nothing’s happening where I could say I’m having a hilarious time, but I’m feeling real good and the world’s fine.", page: 299 },
      { text: "We just flowed into his carport and climbed into his car, a sleek, silver 1973 Cadillac Coupe de Ville, one of the few luxuries he allows himself within an otherwise Spartan lifestyle.", page: 337 },
      { text: "“The only thing I really remember about my early life—and it’s almost too correct now—is just the way things looked: the way a particular street looked or the time of day, or the way a hallway looked in the evening, things of that sort. It’s almost a purely visual memory, with no sense of events at all up until I reached high school.", page: 703 },
      { text: "I just leave oª wondering what was making little Bob so fiercely independent so early on. When Bob speaks of the “charmed” nature of his early life, is this because he actually did experience a happy youth, or because he really was able to disregard whatever pain there was as it was happening, or because he’s been able to disregard it since? One wonders, especially because of the starkness of the solitude this youth subsequently engendered.", page: 783 },
      { text: "Today, when he talks about it, he can’t explain why it happened. It just did, gradually, this distancing of himself from the world: the night walks in Paris, the North African desert, and then, by an ineluctable process, this season on Ibiza.", page: 934 },
      { text: "He does recall how it felt. “It was a tremendously painful thing to do, especially in the beginning. It’s like in the everyday world, you’re just plugged into all the possibilities. Every time you get bored, you plug yourself in somewhere: you call somebody up, you pick up a magazine, a book, you go to a movie, anything. And all of that becomes your identity, the way in which you’re alive. You identify yourself in terms of all that. Well, what was happening to me as I was on my way to Ibiza was that I was pulling all those plugs out, one at a time: books, language, social contacts. And what happens at a certain point as you get down to the last plugs, it’s like the Zen thing of having no ego: it becomes scary, it’s like maybe you’re going to lose yourself. And boredom then becomes extremely painful. You really are bored and alone and vulnerable in the sense of having no outside supports in terms of your own being. But when you get them all pulled out, a little period goes by, and then it’s absolutely serene, it’s terrific. It just becomes really pleasant, because you’re out, you’re all the way out.”", page: 935 },
      { text: "March 15, 1957, the Ferus Gallery opened with a group show entitled Objects on the New Landscape Demanding of the Eye. It featured works by many of the pair’s friends as well as a rich sampling of important contemporary work from San Francisco, including canvases by Richard Diebenkorn, Frank Lobdell, and Clyªord Still.", page: 1025 },
      { text: "Rather than supporting each other in any particular aesthetic positions, the Ferus artists supported each other in their living; their own sense of community sheltered them from the relative indiªerence with which the community at large greeted their eªorts.", page: 1107 },
      { text: "“The Italian painter Giorgio Morandi captivated a lot of us,” Irwin recalls,", page: 1269 },
      { text: "A good painting has a gathering, interactive build-up in it. It’s a psychic build-up, but it’s also a pure energy build-up. And the good artists all knew it, too. That’s what a good Vermeer has, or a raku cup, or a Stonehenge. And when they’ve got it, they just jump oª the goddamn wall at you. They just, bam!”", page: 1363 },
      { text: "It’s been less formal and more of this kind of singular, disciplined taking assessment of my own sensibilities, asking myself how I possibly can do such-and-such, or why I can’t.", page: 1487 },
      { text: "Kierkegaard’s young poet continues, but rather resembles the true rotation method in changing the crop and the mode of cultivation (rather than the field). Here we have the principle of limitation, the only saving principle in the world. The more you limit yourself, the more fertile you be-", page: 1520 },
      { text: "when I asked him where he and Nancy were living during", page: 1546 },
      { text: "“into the Twilight Zone.” The entire enterprise basks in irreality.", page: 1553 },
      { text: "They are now addressing the root questions, which, as in philosophy and physics, are not about the play of superficial ideas or incidents at all. They’re about the basic relationships of the three or four primary aspects of existence in the world: being-in-time, for example, space, presence. When you stop giving them a literate or articulate read (the kind of read you’d give a Renaissance painting) and instead look at them perceptually, you find that your eye ends up suspended in midair, midspace, or midstride: time and space seem to blend in the continuum of your presence.", page: 1663 },
      { text: "evanescent.", page: 1679 },
      { text: "The entire enterprise basks in irreality.", page: 74 },
      { text: "the dots, discs, columns, rooms, desert experiments, and city projects that were to pue follow-all the way to a ground zero, achieved somewhere in the midseventies, when Irwin declared that nonobjective art now meant \"nonobject,\" and that perception itself, independent of any object, was the true art act. But another seeing those late lines is to realize that they themselves were that ground zero, that way in a period of two years Irwin had achieved a complete revolution in his thinking,", page: 84 },
      { text: "You have to make it very clear to anyone who might read your essay, especially any young artist who might happen to pick it was really an intuitive activity in which all of the timeI was only putting one foot up, that my whole process in front of the other, and that each step was not that resolved.", page: 89 },
      { text: "sequent work and indeed today might be seen as the artist's central concern: — — What Robert Irwin is insisting upon, these paintings seem irresistibly to declare, is that the medium is not the message. They explore a division, as absolute as can possibly be demonstrated, between the art-object and the art, between painting and the experience of art. What stays in the museum is only the art-object, not valueless, but not the value of art. The art is what has happened to the viewer. — — \\*Robert Lowell's translation of Rimbaud's “Knowing Girl\" is in Lowell's History (New York: Noonday, 1975),", page: 95 },
      { text: "\"That's a big difference between a West Coast artist and a European. A European artist really believes in himself as part of that historical tradition, that archive. — — They see themselves as part of the stream of history, and they conduct themselves in that way, with a certain amount of importance and self-esteem and so forth. I guess people out here have gained that more now, but when I was growing up as an artist there simply wasn't any stream for you to orient yourself toward. Obviously, you kind of intensity you do. But the minute I start thinking about making gestures about my historical role, I mean, I can't do it, I have to start laughing, because there's think what you do is important, or you wouldn't be pursuing it with the a certain humor in that.'", page: 99 },
      { text: "You start out asking questions and following leads, and it gets to be like being a private detective. I'd already had a bit of experience with that working on the frames for the dots. With the discs I don't know how long it took. There were times I'd set out in the morning and spend two or three weeks driving all day long, tracing a lead down, trying to find someone willing to undertake a particular kind of work.", page: 105 },
      { text: "most of the time I approached them as a store-window decorator. I never approached them as an artist, because that wasn't something they were going to understand-hell, even I didn't understand it-and it only confused mat\\| ters. It was much better to keep it on a practical level, as if you were going to do a hundred signs in this format.", page: 105 },
      { text: "Each time I had to find som thing materially, physically, that had the same scale as the questions I was askine", page: 114 },
      { text: "\"To me teaching is a really interesting activity,\" Irwin ventured, \"and it's also one of the most CC precarious activities in the world, because it's such a huge responsibility.\" Perhaps Irwin CC has been so successful as a teacher because he invests his teaching with the same blend of responsive openness and earnest seriousness with which he animates his art. “", page: 123 },
      { text: "I would think that the most immoral thing one can do is have ambitions for someone else's mind. That's the crux of the challenge and the responsibility of having the opportunity to deal with young people at such a crucial time in their formation. One of the hardest things to do is not to give them cluesHere, do it this way, it's a lot easier-and instead to keep them on the edge of the question.'", page: 125 },
      { text: "I mean. — — be their and that's the last thing you can do for them, that's the worst guru, And wherever I've been, once it begins to shift from why to how, I simply lenu I'm gone.\"", page: 126 },
      { text: "“At that time, as you know .i was beginning to think about using energy in my work, as opposed to matter, and that meant dealing with light and sound and other kinds of energy forms. So the idea that I might be able to talk to some physicists, not about hardware or things of that sort, but rather about how they actually thought about those ideas of space and energy and matter, what their approach was to the whole question, their mental picture: that seemed to me to be something really worth doing.", page: 128 },
      { text: "All art is experience, yet all experience is not art. The artist chooses from experience that which he defines as art, possibly because it has not yet been experienced enough, or because it needs to be experienced more.", page: 131 },
      { text: "All art-world distinctions are meaningless.", page: 131 },
      { text: "I think what happens is that in our ordinary lives we move through the world with a strong expectation-fit ratio which we use as much to block out information as to gather it in-and for good reason, most of the time; we block out information which is not critical to our activity.", page: 133 },
      { text: "Irwin, who was fascinated by the ability of the two eyes to integrate their separate perceptions, mastered a technique for separating their focus: \"Both Wortz and I learned how to do this,\" he claims. \"We taught ourselves by placing a dot on a window and gazing both at and beyond it, thus allowing two planes of focus, one for each else, by staring at a single pencil long enough to become conscious of the separate images we were receiving from each of our eyes. I can still do it any time I want. It takes a few minutes' concentration, but I can just separate them, for example, having one eye register foreground and the other background.", page: 134 },
      { text: "Reason/individual/intuition/feeling: Reason is the processing of our interface with our own subjective being. — — Logic/community/intellect/mental: Logic is the processing of our interface with our objective constructs, our social being.", page: 139 },
      { text: "Another word Irwin uses in this context is inquiry. All these researchers in their own ways are engaged in the process of inquiry, and the most salient feature of inquiry is its open-endedness. It is pursued for no reason whatsoever; it is the project of the passionately curious. The wilderness is stalked by explorers without maps and without any particular goals: their principal compass is their reason.", page: 141 },
      { text: "He is quite adamant on the question of whether society owes the artist a living; he feels it does not. He urges young artists to structure their finances in such that they do not have to rely on the sale of their art: a way he urges them to reduce their material requirements and to cultivate alternative sources of income. The important thing, whenever possible, is to safeguard the art from impinging financial pressures. Irwin does not subscribe to the sackcloth-andashes school of artistic romanticism; he sees no special virtue in starving in garrets.", page: 142 },
      { text: "\"Instead of my overlaying my ideas onto that space, that space overlaid itself on me.", page: 154 },
      { text: "\"I cut the knot. I got rid of the studio, sold all the things I owned, all the equipment, all my stuff; and without knowing what I was going to do with myself or how I was going to spend my time, I simply stopped being an artist in those senses. I just quit.", page: 160 },
      { text: "Whoever you are, go out into the evening, leaving your room, of which you know every bit; your house is the last before the infinite, whoever you are. — — RAINER MARIA RILKE", page: 161 },
      { text: "Irwin chose to absorb the lessons of the desert and apply them, on a site-bysite basis, to each new room whose presence he would be confronting and trying to modulate during the coming years.", page: 165 },
      { text: "What would be left, Irwin hoped, would be that shiver of perception perceiving itself.", page: 194 },
      { text: "\"They were going to spend a lot of money to tear down that obsolete of freeway,\" Irwin explains, \"but I suggested that for the same amount of spur money, they could erect a monument, as it were, to their triumph. I proposed that they extend the supporting buttresses one span beyond the halted freeway, but then, rather than extending the concrete highway to reach that next span, they instead arch the double-decker roadway gently skyward, as if some huge hand had simply come down and peeled the highway back, bringing the whole project to a halt. — — Which is, in effect, what had happened.\"", page: 195 },
      { text: "\"I'm no longer concerned with the art world context,\" Irwin insisted at the time of the Berkeley show. \"I'll use any materials, any techniques (I don't care if some body else is using them or seems to have them earmarked; I don't care if they're thought of as art or nonart), anything that references against the specific conditions of the site. Whether it works is my only criterion.", page: 196 },
      { text: ". What I'm moving toward in my recent work is something I would call, by contrast, 'site-generated.' The site in its absolute particularity dictates to me the possibilities of response.", page: 199 },
      { text: "philosopher Karsten Harries has written, \"Stella projects the ideal of an art that would not allow us 'to avoid the fact that it's supposed to be entirely visual.\" It is significant however that Stella does not claim his art succeeds in being entirely visual. What the work of art is, is not what it is supposed to be. Instead of being fully present, it is only a metaphor of presense.. No matter how radical the pursuit of presence, the work of art will always fall short of that purer art that is its telos. It points beyond itself and lacks the plenitude it demands. — — \"\\*", page: 200 },
      { text: "Instead of being fully present, it is only a metaphor of presence. With this phrase, Harries summons the passion of Irwin's career, the ghost he tries to shake. In everything Irwin has done since the abstract expressionist canvases in the late fifties, he has been trying to approach-and slowly getting closer and closer to his goalthat presence that would not be metaphorical", page: 201 },
      { text: "\"The piece was gentle enough not to make any issues about its existence. And it was as close as I've been able to get to simple presence. The metaphor, the means were minimal. The intellectual connotation that it was about art was just about as minimal as I've ever gotten it, and yet it still did something. It was integrated and \\>\\> yet active.", page: 202 },
      { text: "\"Remember when we talked about the early paintings?\" he asked me one morning. “The thing to realize is that the reduction was a reduction of imagery to get at physicality, a reduction of metaphor to get at presence. I did it within the painting. I had to restrict my means, because the more complex the painting was, the more it became, for me and other people, metaphor. We had to drain it of metaphor so that we'd see the presence. But, at another level, the presence is always there.You can see it in the most restricted things, but you can see it in the most elaborate things, too, so long as you're attending to it.", page: 203 },
      { text: "\"Even revolutions don't cause change: change causes revolutions.\"", page: 204 },
      { text: "Ed Wortz once said to me. \"Sure he's been scared. He's scared of the prospects of his disappearance as an artist, that what he's doing might get sufficiently far enough from the expectations of artists and fellow inquirers that he disappears. That's of concern to him. But it's of interest as well. And face it: it's real exciting having one foot on a banana peel and the other hanging over the edge of an abyss.", page: 205 },
      { text: "In short, he is an artist who one day got hooked on his own curiosity and decided to live it.", page: 206 },
      { text: "He has an extraordinary tolerance for ambiguity: he asks questions that seem by their very nature unanswerable, but he maintains his interest because the questions are legitimate-and are themselves probably more interesting than any answer they might summon", page: 206 },
      { text: "After a pause, Irwin continued, \"It's strange. With food, for instance, people seem able to understand what's involved: you savor the taste rather than just feed the body. But people have a hard time understanding that it should be the same way with visual experience.\"", page: 215 },
      { text: "No wonder there are so many sensory junkies in this town, no wonder people take drugs. Most people in this city-and it's true of most cities are simply oblivious to the incredibly rich spectacle of the everyday world; they're missing out on this visual Disneyland happening all around them all the time. All that drugs do-they don't heighten or brighten one's sense of perception-all they do is momentarily override all the habitual inhibitions to clear seeing which we manage to place in our way most of the rest of the time.", page: 216 },
      { text: "Artists need to be in there from the start, making the argument for quality,\"", page: 222 },
      { text: "As opposed to, say, giving the artist one percent afterwardwhich is, hell, just tokenism to the nth degree", page: 222 },
      { text: "If you asked me for the sum total, asked me, “What is your ambition?\"\" Irwin now said, \"basically, the answer is just to make you a little more aware than you were the day before of how beautiful the world is. This isn't saying that I know what the world should look like. It's not that I'm rebuilding the world. What artists do is to teach you how to exercise your own potential; they always have.", page: 227 },
      { text: "Malevich, Tatlin, Mondrian, de Kooning, Einstein, Watson, Crick, I found myself thinking: a fairly pricey neighborhood into which Irwin keeps insisting on pitching his tent. But, again, his is a strangely egoless egomania: in claiming these mas ters as his colleagues, he's not so much keying on his own importance as asserting the importance of the continuing dialogue. Irwin's sensibility is immensely playful, but the play is absolutely serious. If he speaks of Einstein and Watson, he's merely insisting that art has both the right and the obligation to stake its claims as high as any science. And if he mentions Mondrian or Malevich, he's merely insisting that artists today-the entire discipline-ought to cast their aspirations right up there with the heroes. Play it as it lays and keep it in play", page: 233 },
      { text: "\\*Compare this formulation, offered by the German-Austrian modernist composer Ernst Toch, during a 1932 Pro Musica Society tour of the United States: — — You must listen without always wanting to compare with the musical basis you already have. You must imagine that you inherited from your ancestors different compartments in the musical part of your brain, just as you inherited any other physical or intellectual qualities. Now when you hear a piece from the pre-classic, classic, or romantic periods, the sounds fall without any trouble and agreeably into the already prepared compartments. But when music for which you have no prepared compartments strikes your ear, what happens? Either the music remains outside you or you force it with all your might into one of those compartments, although it does not fit. The compartment is either too long either too narrow or too wide, and that hurts you and you blame the music. But in reality you are to blame, because you force it into a compartment into which it does not fit, instead of calmly, passively, quietly, and without opposition, helping the music to build a new compartment for itself.", page: 234 },
      { text: "only across time. — — \"\" — — Paradoxically, it occurred to me, presence itself, immediacy-Irwin's Holy Grailreveals itself only across time, across the fourth dimension. You have to stop, shut up, and listen if you're ever going to hear.", page: 235 },
      { text: "I talk about Irwin's contradictions, and, in a sense, this is one of the core ones. Because here's an artist who tries time and again to nail down beatitude. He wants to take all that bliss, all that serenity, all that wonder, and-damn it-he wants to batten it down. He wants to batten it down tight and then-ppfff, the tulip opening to simply let it go.", page: 236 },
      { text: "Years ago, when Bob and I were reading philosophy together as a way of getting to know each other, really-we stumbled upon the formulations of a late medieval neoplatonist theologian and philosopher, a mathematician known as Nicolas of Cusa (1401-1464). Nicolas has this wonderful way of talking about the difference between logic and faith or, alternatively, between knowing and truth. Logic, he suggests, knowing, is like an n-sided polygon nested inside a circle. The more sides you add, the more complexities you introduce, the more the polygon approaches the circle which surrounds it. And yet, the farther away it gets as well. For the circle is but a single, seamless line, whereas your polygon seems to be breeding more and more lines, more and more angles, becoming less and less seamless. No matter how many sides you add, no matter how closely the inscribed polygon begins to approximate the circle, it never reaches the circle, and at a certain point a leap is required, from the tangent of the arc, from endlessly compounding multiplicity to singleness of being. Another name for that leap, of course, is grace.", page: 236 },
      { text: "Newly sensitized to the infinitely varied, infinitesimally graduated spectrum of hues and color in nature through his recent intensive work with flowers at the Getty, Irwin now tried to bring a sense of that dazzling variety back inside at the Dia. Disappointed at the surprisingly attenuated range of colors available in standard commercial fluorescent and neon shafts, Irwin resolved to fashion his own by wrapping meticulously selected fluorescent bulbs (variously warmer or cooler in tone) in layer upon layer of wildly various theatrical gels (those transparent sheets of color ordinarily used in lighting stage productions).", page: 263 },
      { text: "maybe it has something to do with the title of that book of yours: because seeing really is forgetting the name of the thing you see. In this instance, you walk in and your brain tells you, oh, that's a red, a yellow, and a blue plane-so that that's what you see. You see 'red,' and 'yellow' and 'blue, and it takes a while for your perceptual apparatus to burn through all that initial cognitive/linguistic labeling.", page: 285 },
      { text: ".) \"The point is to get people to peel those visors off their faces, to remove the goggles, to abandon the screens. Those screens whose very purpose is to screen the actual world out. Who cares about virtuality when there's all this reality-this incredible, inexhaustible, insatiable, astonishing reality-present all around!", page: 292 },
      { text: "Philosophy unties knots in our thinking; hence its results must be simple; but philosophizing has to be as complicated as the knots it unties. — — LUDWIG WITTGENSTEIN Zettel, #452", page: null }
    ]
  },
  {
    title: "Before Forgiveness",
    author: "David Konstan",
    coverImageUrl: "/book_covers/book2.jpg",
    description: "An exploration into the historical origins of forgiveness, arguing that the modern concept of interpersonal forgiveness was largely absent in the ancient world.",
    link: "https://ndpr.nd.edu/reviews/before-forgiveness-the-origin-of-a-moral-idea/",
    highlights: [
      { text: "Charles Griswold writes, \"To forgive someone ... assumes their responsibility for the wrongdoing,\" and it occurs in a context in which the wrongdoer and wronged party accept \"the fact that wrong was indeed done, and done (in some sense) voluntarily.\"3 Again, Alice MacLachlan, in her doctoral dissertation The Nature and Limits of Forgiveness, writes, \"the very act of forgiving - however it is expressed - makes a number of claims: that something wrongful was done, that the wrong has caused harm, and that you (the forgiven) are responsible, even culpable, for this harm\" (MacLachlan 2008: 16). Yet, just in accepting this description, and the idea that guilt of some sort is an indispensable precondition for the possibility of forgiveness, we commit ourselves to a view that, as we shall see in the following chapter, drives a deep wedge between modern and ancient strategies for overcoming the anger and urge to vengeance that arises as a consequence of wrongdoing.", page: 3 },
      { text: "There are times when we do something unintentionally, not because we are not in our right minds or because we have been forced by others, but simply because we did not know all the information relevant to the case.", page: 5 },
      { text: "As in the case of the distinction between voluntary versus involuntary actions in respect to culpability, here again different societies may place unequal weight on these factors, and the extension of forgiveness, or the very nature of a person's responses to offenses, may vary accordingly. This last set of conditions, moreover, will prove to be highly relevant to our understanding of classical Greek and Roman practices of conciliation and the restoration of relationships.", page: 5 },
      { text: "Forgiving cannot be forgetting, or 'getting over' anger by any means whatever. — -griswold", page: 6 },
      { text: "Forgiveness is a far deeper and richer phenomenon, involving, as we shall see, much more reflection and interaction between forgiver and forgiven. So too, no forgiveness exists in which the ostensibly injured party treats the offense as negligible or unworthy of attention, as though it were committed by a child. Such an attitude of aristocratic disdain may manifest itself as indifference to an insult that a lesser person would have resented more deeply; many examples come to mind, including the superior cast of mind of the ancient Stoics, who maintained, with Socrates, that \"a good man cannot be wronged by a bad man\" (Musonius Rufus 10). But again, this is not forgiveness but the denial that an offense was truly given, as the offender was beneath contempt", page: 6 },
      { text: "George Herbert Mead writes (1934: 170): \"A person who forgives but does not forget is an unpleasant companion; what goes with forgiving is forgetting, getting rid of the memory of it\"", page: 6 },
      { text: "Now, sincerity by its nature invites the associated ideas of falseness and hypocrisy, and so it has always to prove itself and be convincing. The strategies for persuading others of one's own honesty in a matter such as moral conversion, which is naturally hidden within, are complex and can all be feigned in turn. Of this, the ancients were aware, when they reflected on the difficulty of distinguishing a true friend from a flatterer or false friend. Thus, Plutarch, in his essay How to Distinguish a Flatterer from a Friend, notes that flattery penetrates “every feeling and every gesture” and hence is \"difficult to separate out” from friendship (51a). An accomplished sycophant knows that frankness is \"the voice of friendship,\" and so he imitates that quality as well (51c). This makes it all the more challenging to discover the true friend.", page: 10 },
      { text: "there is no comparable imperative to confession and repentance in classical accounts of reconciliation or the appeasement of the anger consequent upon a wrongdoing. Correspondingly, the vocabulary of regret, repentance, or a change of mind or attitude (in Greek, metameleia or metanoia; in Latin, paenitentia) is rarely brought into connection with the giving over of anger or with the terms typically, but misleadingly, translated into English as \"forgive.\"", page: 11 },
      { text: "As Robert Kaster remarks, after an exhaustive study of the Latin paenitentia and related words, the idea of \"a change of heart that leads one to seek purgation and forgiveness” was unknown to pre-Christian Romans.¹⁰ So too, David Winston observes that \"Greek philosophy generally had little interest in the feelings of regret or remorse that may at times lead an individual to a fundamental reassessment of his former life path.", page: 11 },
      { text: "But if the ancient Greeks and Romans were conscious of the difficulty in identifying the true sentiments and interests of someone who pretended to be a loyal friend or ally, they were not equally engaged, as we shall see, in seeking to discern an inward change of character as a condition for reconciliation with a wrongdoer.9 Consequently, there is no comparable imperative to confession and repentance in classical accounts of reconciliation or the appeasement of the anger consequent upon a wrongdoing — — Sincerity\" as the mark of a subjective disposition, as opposed to an objective virtue manifested visibly in actions, is a modern idea dating to the late eighteenth century; see Silver 2003 and cf. Trilling 1971, who locates the origins of the modern idea rather in the Renaissance.", page: 11 },
      { text: "As MacLachlan puts it, “The victim of a wrongdoing has certain discretionary powers; that is, the demands of morality leave her free to choose - within some limit - the extent to which the generosity of her response will meet or surpass the demands of justice\" (150). For the offended party to forgive demands certain changes of character as well; to quote MacLachlan once more: “The idea of forgiveness as a change of heart \\[in the forgiver\\] is the image most commonly alluded to by contemporary philosophers writing on the subject\" (57).", page: 12 },
      { text: "Aristotle defines it, is a response to a slight or belittlement, and because, as he points out, \"a slight is a voluntary thing,\" it follows that people are peaceably disposed \"toward those who do not belittle them, or who do so involuntarily, or who at least seem like that” (2.3, 1380a10-12). Thus, you should try to show that you meant just the opposite, or that however you behaved toward the other person you also behave toward yourself, because, as Aristotle says, people do not normally belittle themselves.", page: 23 },
      { text: "Aristotle explains that, by denying what is obvious, the slave seems to be acting shamelessly, and shamelessness in turn resembles contempt - which Aristotle identifies as one of the major stimuli to anger, because contempt is nothing other than a kind of belittlement. So too, Aristotle says, we give over anger toward those who adopt a humble attitude (tapeinoumenoi), because this is a sign that they are beneath us and so fear us, and \"no one belittles a person he fears\" (1380a24). In the same way, we tend to relax our anger against those who beg and plead, because in doing so they humble themselves. Clearly, Aristotle is not so much interested in the sincere expression of regret or remorse, which might elicit forgiveness, as he is in the demonstration that any hint of insult was unintentional, because, by abasing yourself, you openly exhibit your recognition of the other person's superiority - and this is just the opposite of a slight.", page: 24 },
      { text: "Acorn 2007 cites Wagatsuma and Rosett 1986 for an extraordinary case study of the different meanings of apology in Japan and the United States. Acorn observes that the article indicates \"that the failure of cultural understanding between Japanese and North Americans may lie in the fact that apologies have different meanings in the two cultures. In North America a 'good' apology is usually understood to mean something like this: 'I have done something wrong. That wrong has caused you harm. I am responsible for the wrong and I caused the harm you have suffered. I accept that responsibility and I feel remorse.' In Japan, however, Wagatsuma and Rosett's analysis suggests that an apology may mean something quite different. It may mean something more like this: 'I willingly submit to your authority. I humble myself to you and ask submissively that you not to use your authority to harm me.", page: 24 },
      { text: "As Aristotle puts it, \"it is impossible to be afraid and be angry at the same time\" (1380a33-4), the point being that if you are afraid, you have already acknowledged your inferior status, and so have no grounds on which to resent the insult.", page: 25 },
      { text: "Aristotle's discussion of involuntary action in the case of ignorance is equally nuanced. For example, if one commits a wrong in ignorance but later feels no regret (en metameleiâi), then the act hardly counts as unwilling, because one would have done it even had one been fully aware; Aristotle labels such an act, accordingly, \"not voluntary,\" as opposed to \"involuntary\".", page: 27 }
    ]
  },
  {
    title: "The Cambridge Companion to Hannah Arendt",
    author: "Dana Villa",
    coverImageUrl: "/book_covers/arendt_new_cover.jpg",
    description: "This volume examines the primary themes of Hannah Arendt's multi-faceted work, providing a comprehensive overview of her political and philosophical thought.",
    link: "https://www.goodreads.com/en/book/show/127243",
    highlights: [
      { text: "Arendt views the notions of a “people,” “nation,\" and \"state\" as somehow cooriginal: no single term of this triad can exist without the other two.) A \"people\" (or a definite social class, like the workers) may fight against elites for a leadership role in the nation-state, but the \"mob\" always submits to the leadership of the \"strong man.\" A people is active, while the mob is passive or (better) reactive. \"The mob,\" Arendt writes, \"cannot make decisions\"; it can only \"acclaim\" or \"stone\" the objects of its passions.", page: null },
      { text: ".In these terms (taken from Walter Benjamin), she is a pearl diver whose aim is not to resuscitate the past or renew extinct ages, but to introduce crystallizations of rare beauty and profundity into the lives we share with each other.", page: 163 },
      { text: "The more she thought about Marx, the more Arendt came to the conclusion that he was no friend of human freedom at all, and that his fundamental ideas and categories had effaced the phenomenal basis of the most basic political experiences (such as debate amongst diverse equals). The real shock for Arendt, however, was that Marx was hardly unique in this respect. The more she plumbed the depths of the Western tradition of political thought, the more she became convinced that the \"anti-politics\" expressed in Marx's thought had roots which reached as far back as Plato and Aristotle. It was, in other words, at the very beginning of the Western tradition of political thought that a conceptual framework hostile to popular participation, human diversity (what Arendt dubs \"plurality\"), and the open-ended debate between equals had been laid down. This framework came to provide the basic conceptual architecture of Western political thought, with enormous consequences for how we think about the nature of political action, authority, freedom, judgment and (above all) the relation of thought to action.", page: 7 },
      { text: "Arendt's work of the mid to late fifties attempted a fundamental reorientation of political theory. This reorientation has two moments. First, there is a critical or \"deconstructive\" reading of canonical thinkers from Plato to Marx, a reading which aims at revealing the sources of the tradition's hostility toward plurality, opinion, and the politics 7 of debate and deliberation amongst equals. Secondly, there is Arendt's attempt to provide a phenomenological description of the basic components of the active life (the vita activa), the better to distinguish the human capacity for political speech and action from activities driven by natural necessity (such as labor aimed at subsistence) or the need to create, through work or fabrication, the durable things which constitute the physical, objective dimension of the \"human artifice”.", page: 7 },
      { text: "She appeals to the experience of fifth century BC polis politics not because she considers Athenian democracy to be the best political regime, or because she thinks that ancient Greek politics was somehow free of brutal violence and the systematic coercion of women, slaves, and others (it obviously wasn't). Rather, she turns to the Greeks, and to Athens in particular, for the simple reason that the first flowering of democracy was among the most vivid and intense. Athenian political life was a politics of talk and opinion, one which gave a central place to human plurality and the equality between citizens (for the Greeks, the adult male heads of households). The politics of democratic Athens, transformed into something of an \"ideal type\" by Arendt, represents basic political experiences prior to the distortion (or worse, oblivion) they suffered at the hands of a hostile philosophical tradition. — Foremost amongst these fundamental experiences was the sheer clarity of the distinction between the public and private realms, a distinction which the Athenian citizen experienced every time he left the household in order to take part in the assembly or talk in the agora", page: 9 },
      { text: ". The public realm (as represented by the assembly and the agora), on the other hand, was the realm of freedom. It was a legally and institutionally articulated space in which equal citizens met for deliberation, debate, and decision on matters of common concern. It was, moreover, the space in which one acquired a public self in addition to (and distinct from) the private self of the household. 10 In making these claims, Arendt is hardly expressing approval for the way the Greeks structured their private realm.¹¹ Rather, she is underlining the difference between the political sphere (the sphere of a man-made civic equality and freedom) and the economic or household realm (the sphere of hierarchy, necessity, and coercion). We moderns have lost the clarity of this distinction, thanks mainly to what Arendt calls \"the rise of the social\" and the penetration of \"household\" (that is, economic and administrative) concerns into public life", page: 10 },
      { text: "Arendt's celebration of \"local\" political action (done in the right spirit) notwithstanding, she cannot really be grouped with proponents of \"radical\" or \"direct\" democracy. Her experience of totalitarianism led her to place a very strong emphasis upon the importance of worldly institutions and legal frameworks. These provide an arena for, but also limits to, the energies of political action and participation. Only where the \"worldly artifice\" was shored up by the kinds of institutions created by the Founders could political freedom hope to survive. Thus, while Arendt sees the American \"revolutionary spirit” as the \"lost treasure\" of a political culture which has generally preferred to equate freedom with the pursuit of private happiness, she hardly blames the Constitution for this. She knows all too well that \"permanent revolution\" is the most destructive and futile form of politics there is.", page: 14 },
      { text: "Arendt's appreciation of the horrors enabled by ideological belief, combined with her experience of individuals who, like Eichmann, fail to think and (thus) to judge, led her to consistently praise the capacity for independent thought and judgment. She praised this capacity even when it threatened to dissolve the moral verities of a culture or put the judging individual at odds not only with the majority, but with the \"moral taste\" of his or her epoch.37 It is not for nothing that she poses Socrates as the \"model\" thinker whose capacity to undermine custom and convention leads to an enhancement of moral judgment. For it is only by developing the capacity for \"independent thinking for one self\" (Selbstdenken) that the individual can hope to avoid moral catastrophe in those situations where \"everyone else is carried away\" by a wave of misguided conviction or enthusiasm. We see how Arendt balances her appeal (in The Human Condition) for a strengthened \"community\" sense with a strong appreciation of moral and intellectual independence, an appreciation of the moral importance of the \"pariah's point view.\"", page: 18 },
      { text: "Her repeated appeals to debate, deliberation, judgment, and the perspectival formation of opinion obviously place a premium upon the moralrational capacities of ordinary citizens. Her point, rather, was to remind us that there can be no easy synthesis of these two fundamentally opposed ways of life. Between the life of the citizen and the life of the philosopher there lies an unavoidably tragic choice.", page: 19 },
      { text: "“Might the problem of good and evil, our faculty for telling right from wrong, be connected with our faculty of thought? Could the activity of thinking as such, the habit of examining whatever happens to come to pass or attract attention, regardless of results and specific contents, could this activity be among the conditions that make men abstain from evildoing or even actually \"condition\" them against it?”", page: 72 },
      { text: "This anthropological universalism contains an ethics of radical intersubjectivity, which is based on the fundamental insight that all social life and moral relations to others begin with the decentering of primary narcissism. Whereas mortality is the condition that leads the self to withdraw from the world into a fundamental concern with a fate that can only be its own, natality is the condition through which we immerse ourselves into the world, at first through the good will and solidarity of those who nurture us and subsequently through our own deeds and words. Yet insight into the condition of natality, while it enables the de-centering of the subject by revealing our fundamental dependence on others, is not adequate to lead to an attitude of moral respect among equals. The condition of natality involves inequality and hierarchies of dependence. By contrast, Arendt describes mutual respect as \"a kind of 'friendship' without intimacy and without closeness; it is a regard for the person from the distance which the space of the world puts between us. — — \"", page: 81 },
      { text: "Arendt makes this the basis for her critique of modern society, a critique which signals the renewed predominance of the ancient republican conception of freedom in her thought. Hence, the last chapter of On Revolution invokes the virtues of a political \"aristocracy\" of self-chosen citizens against the materialism of the vulgar masses, who piggishly prefer the material comforts of \"private happiness\" to the more austere joys of \"public freedom.\"", page: 191 },
      { text: "“Imagination alone enables us to see things in their proper perspective, to put that which is too close at a certain distance so that we can see and understand it without bias and prejudice, to bridge abysses of remoteness until we can see and understand everything that is too far away from us as though it were our own affair. This \"distancing\" of some things and bridging the abysses to others is part of the dialogue of understanding. “", page: 247 },
      { text: "“Political thought is representative. I form an opinion by considering a given issue from different viewpoints, by making present to my mind the standpoints of those who are absent; that is, I represent them. This process of representation does not blindly adopt the actual views of those who stand somewhere else, and hence look upon the world from a different perspective; this is a question neither of empathy ... nor of counting noses and joining a majority, but of being and thinking in my own identity where actually I am not. The more people's standpoints I have present in my mind while I am pondering a given issue, and the better I can imagine how I would feel and think if I were in their place, the stronger will be my capacity for representative thinking and the more valid my final conclusions, my opinion.”", page: 254 },
      { text: "“Opinions, in fact, are never self-evident. In matters of opinion, but not in matters of truth, “our thinking is truly discursive, running, as it were, from place to place, from one part of the world to another, through all kinds of conflicting views, until it finally ascends from these particularities to some impartial generality.\"33 In this respect one is never alone while forming an opinion; as Arendt notes, even if I shun all company or am completely isolated while forming an opinion, I am not simply together only with myself in the solitude of philosophical thought; I remain in this world of universal interdependence, where I can make myself the representative of everybody else.”", page: 254 },
      { text: "In her view, truth belongs to the realm of cognition, the realm of logic, mathematics and the strict sciences, and carries always an element of coercion, since it precludes debate and must be accepted by every individual in possession of her rational faculties. Set against the plurality of opinions, truth has a despotic character: it compels universal assent, leaves the mind little freedom of movement, eliminates the diversity of views and reduces the richness of human discourse.", page: 255 },
      { text: "The locus classicus of Plato's project for philosophy and politics is to be found in the middle sections of the Republic, in Books V, VI, and VII. The philosopher requires education, the quality of education is related to the quality of the state, and so, Plato gloomily concludes, a corrupt state is likely to smother the rarest philosophical souls. At best, such a state engenders critics, individuals who are in but not of their society. A state with critics is better than one without them, and critical thinking is preferable to the unexamined life, but both are inferior to the authentically philosophical life, which must eschew the falsehoods and half-truths that control public life, and turn away from the \"becoming\" that opposes the eternal, essential truths of \"being\".", page: 263 },
      { text: "Socrates is aware that anything we think we know might be wrong, and that we come to realize this when we expose our ideas to the scrutiny of others. The corollary of this position, however, is that in every opinion, some truth resides.", page: 265 },
      { text: "As Arendt goes on to say, the Platonic opposition between truth and opinionis \"the most anti-Socratic conclusion that Plato drew from Socrates' trial.\"13 Opinions are based on experience, which shapes and limits the perspective of its possessor. We come to understand the opinions of others when we grasp 265 their point of view. In the realm of human affairs, reality (and so by extension, truth) is multiple.", page: 266 },
      { text: "Socrates, by contrast, believes that “the role of the philosopher… is not to rule the city, but to be its 'gadfly,'\" that is, to encourage citizens to think for themselves, not to be instruments of a larger natural or metaphysical order.", page: 266 },
      { text: "For Socrates, living together with others begins by living together with oneself. Socrates' teaching meant: only he who knows how to live with himself is fit to live with others. The self is the only person from whom I cannot depart, whom I cannot leave, with whom I am welded together.", page: 266 },
      { text: "Aristotle concludes that it is friendship not justice (as Plato maintained in the Republic, that great dialogue about justice) that appears to be the bond of communities. For Aristotle, friendship is higher than justice, because justice is no longer necessary between friends.", page: 267 },
      { text: "As Aristotle says, \"a community is not made out of equals, but on the contrary of people who are different and unequal,\" and who therefore rely on the exchange of opinion in friendship to \"equalize\" themselves.25 Socrates too, on Arendt's account, \"seems to have believed that the political function of the philosopher was to help establish this kind of common world, built on the understanding of friendship, in which no rulership is needed.\"", page: 267 },
      { text: "Establishing friendship among Athens's citizens is an ontological imperative, since friendship \"consists of talking about something the friends have in common,\" which over the course of time constitutes a world in its own.", page: 267 },
      { text: "Plato, who sees truth as absolute and singular, regards with \"indifference and contempt the world of the city, and so considers not \"how philosophy looks from the viewpoint of politics but how politics, the realm of human affairs, looks from the viewpoint of philosophy”.", page: 268 },
      { text: "This kind of understanding - seeing the world (as we rather tritely say today)from the other fellow's point of view - is the political insight par excellence. If we wanted to define, traditionally, the one outstanding virtue of the statesman, we could say that it consists in understanding the greatest possible number and variety of realities - not of subjective viewpoints, which of course also exist but do not concern us here - as those realities open themselves up to the various opinions of citizens; and, at the same time, in being able to communicate between the citizens and their opinions so that the commonness of this world becomes apparent.", page: 268 },
      { text: "The Platonic political philosopher is interested in his point of view only; the Socratic political philosopher tests and elaborates his perspective against others'. A Socratic philosophy of multiple perspectives, amenable to rich and surprising development, accords well with the politics of a diverse citizenry: it is democracy perfected.", page: 268 },
      { text: "This was Socrates' way: he sought to engage his fellow citizens in dialogue despite the fact that his sense of wonder separated him from them. Plato, on the other hand, was determined to prolong wonder indefinitely a self-defeating enterprise, argues, since it attempts \"to develop into a way of life. what can Arendt only be a fleeting moment.\"In his attempt to become, as it were, utterly singular, the Platonist, Arendt concludes, destroys the human plurality within himself.)", page: 270 },
      { text: "The political gravamen of Plato's philosophy is to be found, Arendt suggests, in his image (found in Book VII of the Republic) of the cave dweller who surfaces to glimpse the sun and returns to his companions with superior knowledge, but too dazed to deal intelligently with the world underground: — — “The returning philosopher is in danger because he has lost the common sense needed to orient him in a world common to all, and, moreover, because what he harbors in his thought contradicts the common sense of the world.”", page: 270 },
      { text: "In neglecting to cultivate Socrates' remarkable gift for both solitary wonder and friendly, questioning engagement with his fellow citizens, Arendt finds that philosophers after Plato, when they attend to politics at all, evaluate it on the basis of universal ideas - the latter are a misguided way to articulate the properly speechless wonder at the being of being.", page: 270 },
      { text: "For her, the supreme value of politics is freedom, and freedom in Arendt's sense depends on plurality, spontaneity, and the open-ended, unpredictable character of interaction through speech and deed.", page: 271 },
      { text: "Politics, then, is the cultivation of freedom, and freedom is a mode of action that can take place when one appears before an authentic public. A political act is above all a performance, and, as in music or dance, as opposed to the creative arts, \"the accomplishment lies in the performance itself and not in an end which outlasts the activity. \" As a performance, a political act is intended to be distinctive, and so requires \"for its full appearance the shining brightness we once called glory,\" that is, fame, which is a form of opinion.", page: 271 },
      { text: "The Socratic political thinker is apolitical, because he approaches public opinion from a distance, as something to be interrogated, justified, and improved, not merely accepted as commonsensical. As befits one who is able to experience wonder, he takes nothing for granted. Still, because he possesses no absolute knowledge against which to measure the value of public opinion, he does not feel obligated to order or manage human affairs. Politics is not central to his life, but he cannot be entirely indifferent to it, since wonder is a fleeting experience, and he must dwell for the most part in the world of common sense. But he has no reason to look upon politics with the contempt and ressentiment nursed by the Platonic political philosopher, and since he has some reason to enjoy political life, he is not as subject to the tyrannical temptations indulged by Plato and his followers.", page: 272 },
      { text: "From the point of view of common sense, one who is caught up in philosophical wonder is blind and dumb; from the point of view of philosophical wonder, the bustling, opinionated citizenry are even more so.", page: 273 },
      { text: "From the point of view of common sense, one who is caught up in philosophical wonder is blind and dumb; from the point of view of philosophical wonder, the bustling, opinionated citizenry are even more so. Plato resolved this difficulty by recasting the state as an instrument that would guarantee the experience of wonder that he prized. Socrates' resolution of the problem is clearly more appealing to Arendt, because infinitely wiser: he accepted the fact that wonder at being is a transitory experience, and learned to express it in the more circumspect form of cultivating the little miracles that arise in the realm of human affairs. — The radically different context of the modern world undercuts the relevance of Socrates' example. With what Arendt calls \"the collapse of the tradition,\" common sense evaporates, so that \"we can no longer fall back on authentic and undisputable experiences common to all.\" — Unlike Socrates, \\[w\\]e live today in a world in which not even common sense makes sense any longer. The breakdown of common sense in the present world signals that philosophy and politics, their old conflict notwithstanding, have suffered the same fate.", page: 273 },
      { text: "As Oedipus and Hamlet know, and as Friedrich Nietzsche argues, limitless inquiry can prove corrosive when the examined life turns out not to be worth living.", page: 273 },
      { text: "When the tension between common sense and the wonder at being is destroyed, we enter the bleak realm of the \"social,\" of programmed life and scripted, poll-tested politics. In this Kafkaesque world, the suspension of what was once common sense is itself common, and hence uncannily banal.", page: 273 },
      { text: "Arendt's contribution is not to have set right the relationship between philosophy and politics, but to have shown what nourishing food for thought is to be had by reflecting on it.", page: 274 },
      { text: "she makes it clear that thinking is a \"weapon,\" indeed a primary weapon in the struggle against the oppressive bureaucratic forces of society (\"a society of nobodies\") in the fight for genuine freedom.", page: 278 },
      { text: "The thinking that she describes and practices is a creative activity which requires remembrance, story-telling, and imagination. It also requires the virtues of both courage and independence. Furthermore, \"thought itself arises out of incidents of living experience and must remain bound to them as the only guideposts by which to take its bearings”.", page: 280 },
      { text: "Socrates wanted to make the city more truthful by delivering each of its citizens of their truths. The method of doing this is dialegesthai, talking something through, but this dialectic brings forth truth not by destroying doxa or opinion, but on the contrary reveals doxa in its own truthfulness. The role of the philosopher, then, is not to rule the city but to be its \"gadfly,\" not to tell philosophical truths but to make citizens more truthful. The difference with Plato is decisive: Socrates did not want to educate the citizens so much as he wanted to improve their doxai, which constituted the political life in which he took part. To Socrates, maieutic was a political activity, a give and take, fundamentally on a basis of strict equality, the fruits of which could not be measured by the result of arriving at this or that general truth. (\"Philosophy and Politics,\"", page: 281 },
      { text: "Socrates claimed that \"it is much better to be in disagreement with the whole world than being one to be in disagreement with myself,\" he was not only anticipating a fundamental point of logic but also of ethics. \"Ethics, no less than logic, has its origin in this statement, for conscience in its most general sense is also based on the fact that I can be in agreement or disagreement with myself, and that means I do not only appear to others but also to myself\". A fundamental reason why Arendt stresses the linkage of thinking, internal dialogue, solitude, and conscience is because of her experience with totalitarianism. \"The frequently observed fact that conscience itself no longer functioned under totalitarian conditions of political organization\" is explicable when we realize that totalitarian regimes seek to eliminate the very possibility of the solitude required for independent thinking. “No man can keep his conscience intact who cannot actualize the dialogue with himself, that is, who lacks the solitude required for all forms of thinking.", page: 281 },
      { text: "If it should turn out to be true that knowledge (in the modern sense of know-how) and thought have parted company for good, then we would indeed become the helpless slaves, not so much of our machines as of our know-how, thoughtless creatures at the mercy of every gadget which is technically possible, no matter how murderous it is.", page: 282 },
      { text: "What I propose in the following is a reconsideration of the human condition from the vantage point of our newest experiences and our most recent fears. This, obviously, is a matter of thought, and thoughtlessness - the heedless restlessness or hopeless confusion or complacent repetition of \"truths\" which have become trivial and empty seems to me among the outstanding characteristics of our time. What I propose, therefore, is very simple: it is nothing more than to think what we are doing.", page: 282 },
      { text: "For if no other test but the experience of being active, no other measure but the extent of sheer activity were to be applied to the various activities within the vita activa, it might well be that thinking would surpass them all. Whoever has any experience in this matter will know how right Cato was when he said: \"Never is he more active than when he does nothing, never is he less alone than when he is by himself.”", page: 282 },
      { text: "Thinking is the faculty by which we ask unanswerable questions, but questions that we can not help asking. It is the faculty by which we seek to understand the meaning of whatever we encounter. And in the quest for meaning there is (and can be no) finality. The search for knowledge and truth, and the quest for meaning are by no means totally unrelated. On the contrary, although we must not identify or confuse thinking with knowing, genuine knowing would be impossible without thinking, and thinking itself presupposes knowing.", page: 283 },
      { text: "By posing the unanswerable questions of meaning, men establish themselves as question-asking beings. Behind all the cognitive questions for which men find answers, there lurk the unanswerable ones that seem entirely idle and have always been denounced as such. It is more than likely that men, if they were ever to lose the appetite for meaning we call thinking and cease to ask unanswerable questions, would lose not only the ability to produce those thoughtthings that we call works of art but also the capacity to ask all the answerable questions upon which every civilization is founded.", page: 284 },
      { text: "Furthermore, thinking \"does not solve the riddles of the universe. Philosophy, conceived of as a discipline which yields a special kind of knowledge that transcends scientific knowledge, gets entangled in metaphysical fallacies. Thinking, freed from demands of knowing, begins in wonder and increases our sense of wonder. From Arendt's perspective, Kant was not nearly radical enough in liberating thinking from the expectations and demands of knowing. Arendt is closer to Heidegger (who so profoundly influenced her own thinking about thinking) in linking thinking and poetry.", page: 284 },
      { text: "Arendt warns us - in a manner that today seems prophetic — that “totalitarian solutions may well survive the fall of totalitarian regimes in the form of the strong temptations which come up whenever it seems impossible to alleviate political, social or economic misery in a manner worthy of man\" (OT, p. 459). But unless one \"stops and think,' unless one develops the capacity to \"think from the standpoint of somebody else,\" then it becomes all too easy to succumb to evil. Like Socrates' daimon, thinking may not tell us what we ought to do, but it may prevent us from tolerating or becoming indifferent to evil deeds. I", page: 285 },
      { text: "It was the inability to think that Arendt claimed was the most distinctive character trait of Eichmann. \"He was genuinely incapable of uttering a single sentence that was not a cliché\" - clichés that protected him from a sense of reality, and sense of what he was doing. \"The longer one listened to him, the more obvious it became that his inability to speak was closely connected with an inability to think, namely, to think from the standpoint of somebody else. No communication was possible with him, not because he lied but because he was surrounded by the most reliable of all safeguards against words and the presence of others, and hence from reality as such.", page: 286 },
      { text: "In the Meno, Plato portrays Socrates as someone who says: \"It isn't that, knowing the answers myself, I perplex other people. The truth is rather that I infect them also with the perplexity I feel myself\" (p. 431). In short, Socrates \"did not teach anything for the simple reason that he had nothing to teach.\" But he did have the capacity to infect others with the perplexity that he himself experienced. This is the only way in which genuine thinking can be communicated to others.", page: 288 }
    ]
  },
  {
    title: "A General Theory of Love",
    author: "Thomas Lewis, Fari Amini, and Richard Lannon",
    coverImageUrl: "/book_covers/book4.jpg",
    description: "This original and lucid account draws on latest scientific research to show how our nervous systems are not self-contained, but linked with those around us.",
    link: "https://www.goodreads.com/en/book/show/35711",
    highlights: [
      { text: "Oscar Wilde's Miss Prism says in The Importance of Being Earnest, \"Memory, my dear Cecily, is the diary that we all carry about with us.\" Sharp Cecily replies, “Yes, but it usually chronicles the things that have never happened, and couldn't possibly have happened.", page: 104 },
      { text: "Behind the familiar bright, analytic engine of consciousness is a shadow of silent strength, spinning dazzlingly complicated life into automatic actions, convictions without intellect, and hunches whose reasons follow later or not at all. It is this darker system that guides our choices in love.", page: 112 },
      { text: "Take, for instance, a young man unhappily single with good reason. For as long as he can remember, his romances travel the same track. First, the shock of love with its vertiginous rush and the sweet fire in his spine. Mad mutual devotion follows for weeks. Then the first alarming note: a trickle of criticism from his partner. As their relationship settles in, the trickle becomes a torrent and the torrent a cataract. He is lazy; he is thoughtless; his taste in restaurants is banal and his housekeeping habits a horror. When he can't stand it any longer, he breaks off the relationship. Blessed silence and relief descend. As the weeks drag by into months, his newfound ease slides over into loneliness. The next woman he dates reveals herself (after a brief time) to be the doppelgänger of his recently departed ex. Without a woman, his life is empty; with her, it's misery.d These incessant cycles are the present-day echoes of a primal duet, a long-remembered melody from implicit memory. Taken together, his girlfriends present the sketch his mind recorded of his mother-an intelligent and creative woman, but with a short temper and a tendency to externalize and blame. His young brain absorbed that equation; he expects to find that archetype wherever people love. For reasons we will outline in the next chapter, he cannot find anything else. Left to himself, he will not realize there is something else to be found.", page: 117 },
      { text: "People rely on intelligence to solve problems, and they are naturally baffled when comprehension proves impotent to effect emotional change. To the neocortical brain, rich in the power of abstractions, understanding makes all the difference, but it doesn't count for much in the neural systems that evolved before understanding existed. Ideas bounce like so many peas off the sturdy incomprehension of the limbic and reptilian brains. The dogged implicitness of emotional knowledge, its relentless unreasoning force, prevents logic from granting salvation just as it precludes self-help books from helping. The sheer volume and variety of self-help paraphernalia testify at once to the vastness of the appetite they address and their inability to satisfy it.", page: 118 },
      { text: "But like the Wizard of Oz, your brain encourages you to pay no attention to the man behind the curtain. The retina registers color only in the central thirty degrees of the visual field. Visual virtuality, on the other hand, is an omnidirectional chromatic canvashues inferred and presumed and painted in for our with many viewing enjoyment. Assuming the world is the way it looks is the neurally prompted so-called naïve realism to which most of us unwittingly subscribe. Among the many certainties in life, Umberto Eco writes, one is supreme: \"All things appear to us as they appear to us, and it is impossible for them to appear otherwise.\"", page: 119 },
      { text: "Because a neural network taps into the brain's own dataprocessing mechanism, it arrives at sophisticated, unanalyzable inferences-as does humanity's emotional heart. Understand how a neural network functions, and will know the innermost secrets of the intuyou itions that guide us in love.", page: 123 },
      { text: "One manifestation of these orchestral evocations is the immediate selectivity of emotional memory. Gleeful people automatically remember happy times, while a depressed person effortlessly recalls incidents of loss, desertion, and despair. Anxious people dwell on past threats; paranoia instills a retrospective preoccupation with situations of persecution. If an emotion is sufficiently powerful, it can quash opposing networks so completely that their content beçomes inaccessible-blotting out discordant sections of the past", page: 130 },
      { text: "Because human beings remember with neurons, we are disposed to see more of what we have already seen, hear anew what we have heard most often, think just what we have always thought. Our minds are burdened by an informational inertia whose headlong course is not easy to slow. As a life lengthens, momentum gathers. A wistful aside from two neuroscience researchers:", page: 141 },
      { text: "Who we are and who we become depends, in part, on whom we love.", page: 144 },
      { text: "The more often you do or think or imagine a thing, the more probable it is that your mind will revisit its prior stopping point. When the circuits are sufficiently well worn such that thoughts fly down them with little friction or resistance, that mental path has become a part of you-it is now a habit of speech, thought, action, attitude. Ongoing exposure to one person's Attractors does not merely activate neural patterns in another-it also strengthens them. Long-standing togetherness writes permanent changes into a brain's open book.", page: 144 },
      { text: "Fuzzy people exist, he tells us in this scene, people whose selves, not their bodies, are painfully indeterminate. Such a person enters psychotherapy because he does not know who he is. To people who do know, the predicament sounds improbable. But a person cannot know himself until another knows him", page: 156 },
      { text: "That concentrated knowledge whispers to a child from beneath the veil of consciousness, telling him what relationships are, how they function, what to anticipate, how to conduct them. If a parent loves him in the healthiest way, wherein his needs are paramount, mistakes are forgiven, patience is plentiful, and hurts are soothed as best they can be, then that is how he will relate to himself and others. Anomalous love-one where his needs don't matter, or where love is suffocating or autonomy intolerable-makes its ineradicable limbic stamp. Healthy loving then becomes incomprehensible.", page: 160 },
      { text: "A relationship that strays from one's prototype is limbically equivalent to isolation. Loneliness outweighs most pain. These two facts collude to produce one of love's common and initially baffling quirks: most people will choose misery with a partner their limbic brain recognizes over the stagnant pleasure of a \"nice\" relationship with someone their attachment mechanisms cannot detect.", page: 161 },
      { text: "Psychotherapy grapples with these questions daily. A therapist does not wish merely to discern the trajectory of an emotional life but to determine it. Helping someone escape from a restrictive virtuality means reshaping the bars and walls of a prison into a home where love can bloom and life flourish. In the service of this goal, two people come together to change one of them into somebody else. 4 bob", page: 166 },
      { text: "-People do come to therapy unable to love and leave with that skill restored. But love is not only an end for therapy; it is also the means whereby every end is reached. In this chapter we will examine how love's three neural faces-limbic resonance, regulation, and revision-constitute psychotherapy's core and the motive force behind the adult mind's capacity for growth.", page: 169 },
      { text: "When people are hurting and out of balance, they turn to regulating affiliations: groups, clubs, pets, marriages, friendships, masseuses, chiropractors, the Internet. All carry at least the potential for emotional connection. Together, those bonds do more good than all the psychotherapists on the planet.", page: 171 },
      { text: "The neocortical brain collects facts quickly. The limbic brain does not. Emotional impressions shrug off insight but yield to a different persuasion: the force of another person's Attractors reaching through the doorway of a limbic connection. Psychotherapy changes people because one mammal can restructure the limbic brain of another.", page: 177 },
      { text: "Self-help books are like car repair manuals: you can read them all day, but doing so doesn't fix a thing. Working on a car means rolling up your sleeves and getting under the hood, and you have to be willing to get dirt on your hands and grease beneath your fingernails. Overhauling emotional knowledge is no spectator sport; it demands the messy experience of yanking and tinkering that comes from a limbic bond. If someone's relationships today bear a troubled imprint, they do so because an influential relationship left its mark on a child's mind. When a limbic connection has established a neural pattern, it takes a limbic connection revise it.", page: 177 },
      { text: "A person who needs limbic revision possesses pathologic Attractors. Everyone who comes within range feels at least some of the unhappiness inherent in his world, and that intimation repels many potentially healthy partners. Those who stay often do so because they recognize a pattern from their own pasts. For them it is a siren song. Relatedness engenders a brand loyalty that beer companies would kill for: your own relationship style entices. Others are wearisome and, in short order, unpalatable. Thus people who bond share unspoken assumptions about how love works, and if the Attractors underlying those premises need changing, they are frequently the last people in the world who can help each other.", page: 181 },
      { text: "We should always remember that the work of art is invariably the creation of a new world, so that the first thing we should do is to study that new world as closely as possible, approaching it as something brand new, having no obvious connection with the worlds we already know. When this new world has been closely studied, then and only then let us examine its links with other worlds, other branches of knowledge.", page: 182 },
      { text: "therapy is as timeconsuming and costly as a college education. But, to paraphrase Harvard's president, Derek Bok, those put off by the expense of education may find ignorance an even costlier indulgence.", page: 187 },
      { text: "It is difficult to get the news from poems yet men die miserably every day for lack of what is found there. — — -William Carlos Williams", page: 191 },
      { text: "To paraphrase Mark Twain: the difference between a caretaker who tunes in to a child and one who almost tunes in is as great as the difference between lightning and a lightning bug.", page: 200 },
      { text: "Psychologist Judith Wallerstein studied families for five years after divorce and found in the children \"a dismayingly high incidence of depression\" at every point along the way. Divorce's great danger for children is, she writes, \"in the diminished or disrupted parenting which so often follows in the wake of the rupture and which can become consolidated within the postdivorce family.", page: 204 },
      { text: "\"Fathers and teachers,\" wrote Dostoyevsky, \"I ponder the question, 'What is Hell?' I maintain it is the suffering of being unable to love.", page: 204 },
      { text: "Jean Giraudoux: \"If two people who love each other let a single instant wedge itself between them, it growsit becomes a month, a year, a century; it becomes too late.", page: 205 },
      { text: "If somebody must jettison a part of life, time with a mate should be last on the list: he needs that connection to live. Couples do not receive this advice from friends, colleagues, family-their world. Instead they are encouraged to achieve, not attach. Americans spur one another to accomplish and acquire before anything else-our national dream holds that industry leads to a promised land, and nobody wants to miss out on a share of paradise. When consummating a career does not bring happiness as it cannot-few pause to reconsider their assumptions; most redouble their efforts. The faster they spin the occupational centrifuge, the more its high-velocity whine drowns out the wiser whisper of their own hearts.", page: 206 },
      { text: "When consummating a career does not bring happiness—as it cannot-few pause to reconsider their assumptions; most redouble their efforts. The faster they spin the occupational centrifuge, the more its high-velocity whine drowns out the wiser whisper of their own hearts", page: 206 },
      { text: "our culture fawns over the fleetingness of being in love while discounting the importance of loving.", page: 206 },
      { text: "Loving is limbically distinct from in love. Loving is mutuality; loving is synchronous attunement and modulation. As such, adult love depends critically upon knowing the other. In love demands only the brief acquaintance necessary to establish an emotional genre but does not demand that the book of the beloved's soul be perused from preface to epilogue. Loving derives from intimacy, the prolonged and detailed surveillance of a foreign soul.", page: 207 },
      { text: "When somebody loses his partner and says a part of him is gone, he is more right than he thinks. A portion of his neural activity depends on the presence of that other living brain. Without it, the electric interplay that makes up him has changed. Lovers hold keys to each other's identities, and they write neurostructural alterations into each other's networks. Their limbic tie allows each to influence who the other is and becomes", page: 208 },
      { text: "Love cannot be extracted, commanded, demanded, or wheedled. It can only be given", page: 209 },
      { text: "Happiness is within range only for adroit people who the slip to America's values. These rebels will necessarily forgo give exalted titles, glamorous friends, exotic vacations, washboard abs, designer everything all the proud indicators of upward mobility-and in exchange, they may just get a chance at a decent life.", page: 209 },
      { text: "Study after study has shown that children with close familial ties are far less likely to become entangled in substance abuse. Even under ideal circumstances, teenage years abound in emotional surges, changing roles, growing pains. If adolescents do not receive limbic stability from relationships in the home, they will be measurably more susceptible to chemical options outside", page: 213 },
      { text: "Recall that the brains of neglected children show neurons missing by the billions. Lest anyone think those vanished cells are inconsequential, our own children prove otherwise", page: 219 },
      { text: "From the beginning of the twentieth century to its end, influential accounts of love included no biology. It has been said that neurotics build castles in the sky, while psychotics live in them, and psychiatrists collect the rent. But it is the psychiatrists and psychologists who have been living within a palace of theory suspended over a void. When they built their understanding of the emotional mind, the brain was a cipher. The foundations of their edifice had to be fashioned out of the only substance in plentiful supply—the purest speculation.", page: 6 },
      { text: "The purpose behind discerning the nature of love is not to satisfy ivory tower discussions or to produce fodder for academic delectation. Instead, as our work makes all too clear, the world is full of live men and women who encounter difficulty in loving or being loved, and whose happiness depends critically upon resolving that situation with the utmost expediency.", page: 9 },
      { text: "Those who attempt to study the body without books sail an uncharted sea, William Osler observed, while those who only study books do not go to sea at all.", page: 12 },
      { text: "After several years of cross-pollination from a panoply of disciplines, the interdisciplinary maelstrom coalesced. We began to think of love and to describe it to one another in terms we had never heard. A revolutionary paradigm assembled itself around us, and we have remained within it ever since. Within that structure, we found new answers to the questions most worth asking about human lives: what are feelings, and why do we have them? What are relationships, and why do they exist? What causes emotional pain, and how can it be mendedwith medications, with psychotherapy, with both? What is therapy, and how does it heal? How should we configure our society to further emotional health? How should we raise our children, and what should we teach them? — The investigation of these queries is not just an intellectual excursion: people must have the answers to make sense of their lives. We see the need for this knowledge every day, and we see the bitter consequences of its lack. People who do not intuit or respect the laws of acceleration and momentum break bones; those who do not grasp the principles of love waste their lives and break their hearts.", page: 13 },
      { text: "After several years of cross-pollination from a panoply of disciplines, the interdisciplinary maelstrom coalesced. We began to think of love and to describe it to one another in terms we had never heard. A revolutionary paradigm assembled itself around us, and we have remained within it ever since. Within that structure, we found new answers to the questions most worth asking about human lives: what are feelings, and why do we have them? What are relationships, and why do they exist? What causes emotional pain, and how can it be mended-with medications, with psychotherwith both? What is therapy, and how does it heal? How should apy, we configure our society to further emotional health? How should we raise our children, and what should we teach them? — — The investigation of these queries is not just an intellectual excursion: people must have the answers to make sense of their lives. — — We see the need for this knowledge every day, and we see the bitter consequences of its lack. People who do not intuit or respect the laws of acceleration and momentum break bones; those who do not grasp the principles of love waste their lives and break their hearts. The evidence of that pain surrounds us, in the form of failed marriages, hurtful relationships, neglected children, unfulfilled ambitions, and thwarted dreams. And in numbers, these injuries combine to damage our society, where emotional suffering and its ramifications are commonplace. The roots of that suffering are often unseen and passed over, while proposed remedies cannot succeed, because they contradict emotional laws that our culture does not yet recognize.", page: 13 },
      { text: "Advertising vulnerability makes sense only for those animals whose brains can conceive of a parental protector.", page: 26 },
      { text: "The more we discover, the more we find that we do not know. As E. E. Cummings observed: Always a more beautiful answer that asks a more beautiful question.", page: 29 },
      { text: "Because people are most aware of the verbal, rational part of their brains, they assume that every part of their mind should be amenable to the pressure of argument and will. Not so. Words, good ideas, and logic mean nothing to at least two brains out of three. Much of one's mind does not take orders. — — \"From modern neuroanatomy,\" writes a pair of neuroscience researchers, “it is apparent that the entire neocortex of humans continues to be regulated by the paralimbic regions from which it evolved.\" The novelist Gene Wolfe makes an identical, albeit lovelier, observation: — — thisgog ble d qmol We say, \"I will,\" and \"I will not,\" and imagine ourselves (though we obey the orders of some prosaic person every day) our own masters, when the truth is that our masters are sleeping. One wakes within us, and we are ridden like beasts, though the rider is but some hitherto unguessed part of ourselves.", page: 33 },
      { text: "Our society underplays the importance of emotions. Having allied itself with the neocortical brain, our culture promotes analysis over intuition, logic above feeling. Cognition can yield riches, and from human intellect has made our lives easier in ways that range indoor plumbing to the Internet. But even as it reaps the benefits of reason, modern America plows emotions under-a costly practice that obstructs happiness and misleads people about the nature and significance of their lives", page: 37 },
      { text: "Emotionality's code arises from a uniform neural architecture. The task of emotion science is to excavate this archaic structure, and as it has done so, it has unearthed the very roots of love. — — Human beings, as tool-making animals, are prone to associate importance with durability. The columns of the Parthenon or the massive stone blocks of looming pyramids easily elicit our wonder and The momentousness of emotions in human lives stands in befuddling contrast to their impossible brevity. Emotions are mental mayflies, rapidly spawned and dying almost as quickly as they arise. High-speed videography shows that facial expressions begin within milliseconds of a provocative event, and they fade immediately", page: 43 },
      { text: "people tend to think about emotionally arousing occasions afterward, recirculating the experience and stimulating the consequent emotion just as if the inciting event had actually reoc curred. The human penchant for this post hoc cogitation can magnify the physiologic impact of an emotion many times. Anger sharply increases blood pressure on a short-term basis, for instance, but it may well be the recurrent stewing over provocative events that causes sustained hypertension in touchy people like type A executives. The neocortical brain's tendency to wax hypothetical then becomes a deadly liability. The limbic brain, unable to distinguish between incoming sensory experience and neocortical imaginings, revisits emotions upon a body that was not designed to withstand such a procession", page: 46 },
      { text: "\"Dream delivers us to dream, and there is no end to illusion. Life is a train of moods like a string of beads, and, as we pass through them, they prove to be many-colored lenses which paint the world their own hue.... Temperament is the iron wire on which the beads are strung.\" Writing these lines in 1844, Ralph Waldo Emerson may deserve credit as the first to propose that emotionality is hardwired.", page: 47 },
      { text: ". While the locus of danger in our lives has changed, the underlying neural mechanisms remain. Those worry circuits still perform the same function: under their direction, people imagine future harm, withdraw from potential threats, and their hearts, lungs, and sweat glands warm up for sudden use. An unfortunate few suffer from a hair-trigger sensitivity in this primordial system. When the neural alarm apparatus goes off with a bang, the result is a panic attack-a paroxysm of terror, an explosion of somatic sensations and reactions (chest tightness, racing heart, sweaty palms, churning stomach), and an outpouring of fear-soaked expectations and plans.", page: 49 },
      { text: "those who spend their days without an opportunity for quiet listening can pass a lifetime and overlook it altogether. The vocation of psychotherapy confers a few unexpected fringe benefits on its practitioners, and the following is one of them. It impels participation in a process that our modern world has all but forgotten: sitting in a room with another person for hours at a time with no purpose in mind but attending. As you do so, another world expands and comes alive to your senses—a world governed by forces that were old before humanity began.", page: 65 },
      { text: "Forty percent of children who contracted measles succumbed to the virus, for example, at a time when the measles mortality rate in the community outside the institution was .5 percent. \"The worst offenders,\" Spitz wrote, \"were the best equipped and most hygienic institutions.\" Death rates at the so-called sterile nurseries near the turn of the century were routinely above 75 percent, and in at least one case, nearly 100 percent. Spitz had rediscovered that a lack of human interaction-handling, cooing, stroking, baby talk, and play-is fatal to infants. 1940’s", page: 70 },
      { text: "As the children matured, mothers' parenting aptitude predicted more and more budding personality traits. Babies of responsive mothers developed into grade-schoolers who were happy, socially competent, resilient, persistent, likable, and empathic with others. They had more friends, were relaxed about intimacy, solved problems on their own when they could, and sought help when they needed it. Infants reared by the cold mothers grew up to be distant, difficult-to-reach kids who were hostile to authority, shunned togetherness, and wouldn't ask for comfort, particularly when they were hurt. They often had a mean streak and seemed to take pleasure in provoking and upsetting other children. ￼", page: 74 },
      { text: "In his fascinating book Love & Survival, Dean Ornish surveyed the medical literature on the relationship between isolation and human mortality. His conclusion: dozens of studies demonstrate that solitary people have a vastly increased rate of premature death from all causes they are three to five times likelier to die early than people with ties to a caring spouse, family, or community.", page: 80 },
      { text: "Dean Ornish surveyed the medical literature on the relationship between isolation and human mortality. His conclusion: dozens of studies demonstrate that solitary people have a vastly increased rate of premature death from all causes they are three to five times likelier to die early than people with ties to a caring spouse, family, or community.", page: 80 },
      { text: "The prevailing medical paradigm has no capacity to incorporate the concept that a relationship is a physiologic process, as real and as potent as any pill or surgical procedure.", page: 80 },
      { text: "MOURNING BECOMES ELECTRIC — — Take a puppy away from his mother, place him alone in a wicker will witness the universal mammalian reaction to the pen, and you rupture of an attachment bond-a reflection of the limbic architecture mammals share. Short separations provoke an acute response known as protest, while prolonged separations yield the physiologic state of despair. — — A lone puppy first enters the protest phase. He paces tirelessly, scanning his surroundings from all vantage points, barking, scratching vainly at the floor. He makes energetic and abortive attempts at scaling the walls of his prison, tumbling into a heap with each failure. He lets out a piteous whine, high-pitched and grating. — — Every aspect of his behavior broadcasts his distress, the same discomfort that all social mammals show when deprived of those to whom they are attached. Even young rats evidence protest: when their mother is absent they emit nonstop ultrasonic cries, a plaintive chorus inaudible to our dull ape ears. — — Human adults exhibit a protest response as much as any other mammal. Anyone who has been jilted in an infatuation (i.e., just about everybody) has experienced the protest phase firsthand-the inescapable inner restlessness, the powerful urge to contact the son (“just to talk”), mistaken glimpses of the lost figure everywhere (a seething combination of overly vigilant scanning and blind hope). All are part of protest. The drive to reestablish contact is sufficiently formidable that people often cannot resist it, even when they understand that the other person doesn't doesn't want anything to do with them. Human beings manifest searching and calling in lengthy letters, frantic phone calls, repeated e-mails, and telephoning an answering machine just to hear another's voice. The tormented letter that a rejected lover composes turns out to be an updated version of a baby rat's constant peep: the same song, in a slightly lower pitch. — — A mammal in protest shows a distinct physiology. Heart rate at.and body temperature increase, as do the levels of catecholamines and th cortisol. Catecholamines (like adrenaline) elevate alertness and activity. A young mammal who has lost his mother ought to stay alert long enough to find her, and the rise in catecholamines during protest promotes his vigil. This part of the ancient attachment machinery may also keep a human being staring at the ceiling all night after a breakup. Cortisol is the body's major stress hormone, and its sharp elevation in separated mammals tells us that relationship rupture is a severe bodily strain. Cortisol levels rise sixfold in some mammals after just thirty minutes of isolation.", page: 76 },
      { text: "The mammalian nervous system depends for its neurophysiologic stability on a system of interactive coordination, wherein steadiness comes from synchronization with nearby attachment figures. Protest is the alarm that follows a breach in these life-sustaining adjustments. If the interruption continues, physiologic rhythms decline into the painful unruliness of despair. Evolution has given mammals a shimmering conduit, and they use it to tinker with one another's physiology, to adjust and fortify one another's fragile neural rhythms in the collaborative dance of love.", page: 84 },
      { text: "This necessary intermingling of physiologies makes relatedness and communal living the center of human life. We recognize instinctively that healthy humans are not loners. In children's stories and in life, disease creates hermits and cabindwelling Kaczynskis. Limbic regulation makes expulsion from the company of others the cruelest punishment human beings can devise. When his friend Friar Laurence tells Romeo that his death sentence has been commuted to interminable exile, Romeo's heart prepares to break:", page: 86 },
      { text: "When people have trouble with their emotions-a bout of anxiety or depression, say, or seasonal gloominess-they often want science to pinpoint an offending neurotransmitter in the way that a witness picks the perp out of a lineup. Is it excessive norepinephrine, too little dopamine, errant estrogen? The answer is apt to dissatisfy: no single suspect can be fingered with confidence bequestion itself attributes a fallacious simplicity to the cause the brain.", page: 91 },
      { text: "As a society, if we do not attend to the limbic needs of our own young, we risk creating an epidemic of loss vulnerability. Serotonin agents will then become not just a remedy to retrieve those few teetering on the brink of desolation's abyss, but a way of life for a culture that has settled on the lip of the precipice itself.", page: 93 },
      { text: "Given the open-loop physiology of mammals and their dependence on limbic regulation, attachment interruptions are dangerous. They ought to be highly aversive. And so they are: like a shattered knee or a scratched cornea, relationship ruptures deliver agony. Most people say that no pain is greater than losing someone they love.", page: 95 },
      { text: "To understand how attachment sculpts a person, we need to apprehend memorythe process whereby the brain undergoes structural change from experience. Memory does not travel a straight line, and neither does the human heart.", page: 99 },
      { text: "But the vertical conceptualization of evolution is fallacious. Evolution is a kaleidoscope, not a pyramid: the shapes and variety of species are constantly shifting, but there is no basis for assigning supremacy, no pinnacle toward which the system is moving.", page: 514 },
      { text: "Five hundred million years ago, every species was either adapted to that world or changing to become so. The same is true today. We are free to label ourselves the end product of evolution not because it is so, but because we exist now.", page: 516 }
    ]
  },
  {
    title: "No Rules Rules",
    author: "Reed Hastings and Erin Meyer",
    coverImageUrl: "/book_covers/book5.jpg",
    description: "Netflix co-founder Reed Hastings and professor Erin Meyer explore the controversial management philosophy and culture of freedom and responsibility that powered Netflix's success.",
    link: "https://www.norulesrules.com/",
    highlights: [
      { text: "Netflix assumes that you have amazing judgment, . . . . And judgment is the solution for almost every ambiguous problem. Not process. The flip side . . . is that people are expected to work at a super-high level or be quickly shown the door (with a generous severance package).", page: 255 },
      { text: "Those who were exceptionally creative, did great work, and collaborated well with others went immediately into the “keepers” pile.", page: 342 },
      { text: "If you have a team of five stunning employees and two adequate ones, the adequate ones will sap managers’ energy, so they have less time for the top performers, reduce the quality of group discussions, lowering the team’s overall IQ, force others to develop ways to work around them, reducing efficiency, drive staff who seek excellence to quit, and show the team you accept mediocrity, thus multiplying the problem.", page: 395 },
      { text: "In dozens of trials, conducted over month-long periods, groups with one underperformer did worse than other teams by a whopping 30 to 40 percent.", page: 417 },
      { text: "whenever someone came to me to complain about another employee, I would ask, “What did that person say when you spoke to him about this directly?” This is pretty radical. In most situations, both social and professional, people who consistently say what they really think are quickly isolated, even banished. But at Netflix, we embrace them. We work hard to get people to give each other constructive feedback—up, down, and across the organization—on a continual basis.", page: 513 },
      { text: "When giving and receiving feedback is common, people learn faster and are more effective at work.", page: 538 },
      { text: "In a 2014 study, the consulting firm Zenger Folkman collected data on feedback from almost one thousand people. They found that, despite the blissful benefits of praise, by a roughly three-to-one margin, people believe corrective feedback does more to improve their performance than positive feedback.", page: 611 },
      { text: "Feedback helps us to avoid misunderstandings, creates a climate of co-accountability, and reduces the need for hierarchy and rules.", page: 635 },
      { text: "The first technique our managers use to get their employees to give them honest feedback is regularly putting feedback on the agenda of their one-on-one meetings with their staff. Don’t just ask for feedback but tell and show your employees it is expected. Put feedback as the first or last item on the agenda so that it’s set apart from your operational discussions. When the moment arrives, solicit and encourage the employee to give feedback to you (the boss) and then—if you like—you can reciprocate by giving feedback to them.", page: 653 },
      { text: "You must show the employee that it’s safe to give feedback by responding to all criticism with gratitude and, above all, by providing “belonging cues.”", page: 658 },
      { text: "I speak with my leadership team frequently about displaying “belonging cues” in situations when an employee is providing feedback to the boss, because an employee who is courageous enough to give feedback openly is likely to worry, “Will my boss hold it against me?” or “Will this harm my career?”", page: 661 },
      { text: "A belonging cue might be a small gesture, like using an appreciative tone of voice, moving physically closer to the speaker, or looking positively into that person’s eyes. Or it might be larger, like thanking that person for their courage and speaking about that courage in front of the larger team. Coyle explains that the function of a belonging cue “is to answer the ancient ever-present question glowing in our brains: Are we safe here? What’s our future with these people? Are there dangers lurking?”", page: 663 },
      { text: "AIM TO ASSIST: Feedback must be given with positive intent.", page: 757 },
      { text: "ACTIONABLE: Your feedback must focus on what the recipient can do differently.", page: 762 },
      { text: "When you receive feedback, you need to fight this natural reaction and instead ask yourself, “How can I show appreciation for this feedback by listening carefully, considering the message with an open mind, and becoming neither defensive nor angry?”", page: 769 },
      { text: "You are required to listen and consider all feedback provided. You are not required to follow it. Say “thank you” with sincerity. But both you and the provider must understand that the decision to react to the feedback is entirely up to the recipient.", page: 772 },
      { text: "The only remaining question is when and where to give feedback—and the answer is anywhere and anytime.", page: 785 },
      { text: "it doesn’t matter how brilliant your jerk is, if you keep him on the team you can’t benefit from candor. The cost of jerkiness to effective teamwork is too high. Jerks are likely to rip your organization apart from the inside.", page: 824 },
      { text: "A culture of candor does not mean that you can speak your mind without concern for how it will impact others.", page: 835 },
      { text: "other general critical-feedback guidelines—such as “Never give criticism when you’re still angry” and “Use a calm voice when giving corrective feedback”—could have helped too.", page: 852 },
      { text: "When it comes to how we judge performance at Netflix, hard work is irrelevant. Nevertheless,", page: 898 },
      { text: "If you want to remove the vacation policy in your organization, lead by example.", page: 1023 },
      { text: "Studies show that well over half the population will readily cheat the system to get more for themselves if they think they won’t be caught.", page: 1189 },
      { text: "When removing your vacation policy, explain that there is no need to ask for prior approval and that neither the employees themselves nor their managers are expected to keep track of their days away from the office.", page: 1363 },
      { text: "The practices modeled by the boss will be critical to guide employees as to the appropriate behavior. An office with no vacation policy but a boss who never vacations will result in an office that never vacations.", page: 1370 },
      { text: "A 2018 survey by OfficeTeam asked twenty-eight hundred workers what reasons would motivate them to pack up their desk and quit their jobs. Some 44 percent of respondents, well over any other category, stated they would leave their current job for one that pays more.", page: 1515 },
      { text: "The risk is that employees will focus on a target instead of spot what’s best for the company in the present moment.", page: 1551 },
      { text: "“I have no idea why I was offered a contract with a bonus in it because I promise you I will not work any harder or any less hard in any year, in any day because someone is going to pay me more or less.” Any executive worth her paycheck would say the same.", page: 1560 },
      { text: "Contingent pay works for routine tasks but actually decreases performance for creative work. Duke University professor Dan Ariely describes what he found in a fascinating study that he wrote in 2008:", page: 1563 },
      { text: "Creative work requires that your mind feel a level of freedom. If part of what you focus on is whether or not your performance will get you that big check, you are not in that open cognitive space where the best ideas and most innovative possibilities reside. You do worse.", page: 1579 },
      { text: "Divide your workforce into creative and operational employees. Pay the creative workers top of market. This may mean hiring one exceptional individual instead of ten or more adequate people.", page: 1829 },
      { text: "There is no better way to build trust quickly than to shine a light directly on a would-be secret.", page: 1887 },
      { text: "Spinning the truth is one of the most common ways leaders erode trust. I can’t say this clearly enough: don’t do this. Your people are not stupid. When you try to spin them, they see it, and it makes you look like a fraud. Speak plainly, without trying to make bad situations seem good, and your employees will learn you tell the truth.", page: 2152 },
      { text: "Bruk concluded that honesty about mistakes is good for relationships, health, and job performance.", page: 2239 },
      { text: "The pratfall effect is the tendency for someone’s appeal to increase or decrease after making a mistake, depending on his or her perceived ability to perform well in general.", page: 2248 },
      { text: "the takeaway: a leader who has demonstrated competence and is liked by her team will build trust and prompt risk-taking when she widely sunshines her own mistakes. Her company benefits. The one exception is for a leader considered unproven or untrusted. In these cases you’ll want to build trust in your competency before shouting your mistakes.", page: 2253 },
      { text: "Open up the books to your employees. Teach them how to read the P&L. Share sensitive financial and strategic information with everyone in the company.", page: 2263 },
      { text: "DON’T SEEK TO PLEASE YOUR BOSS. SEEK TO DO WHAT IS BEST FOR THE COMPANY.", page: 2305 },
      { text: "Dispersed decision-making can only work with high talent density and unusual amounts of organizational transparency.", page: 2325 },
      { text: "If your employees are excellent and you give them freedom to implement the bright ideas they believe in, innovation will happen.", page: 2413 },
      { text: "“We don’t expect employees to get approval from their boss before they make decisions. But we do know that good decisions require a solid grasp of the context, feedback from people with different perspectives, and awareness of all the options.”", page: 2468 },
      { text: "In Malcolm Gladwell’s book Outliers, we learn that a major plane crash was caused when Korean Air staff refrained from telling the lead pilot that there was a problem because they wanted to show respect for his authority. This tendency is human.", page: 2512 },
      { text: "If you are a Netflix employee with a proposal, you create a shared memo explaining the idea and inviting dozens of your colleagues for input. They will then leave comments electronically in the margin of your document, which everyone can view. Simply glancing through the comments can give you a feeling for a variety of dissenting and supporting viewpoints.", page: 2523 },
      { text: "In some cases, an employee proposing an idea will distribute a shared spreadsheet asking people to rate the idea on a scale from –10 to +10, with their explanation and comments. This a great way to get clarity on how intense the dissent is and to begin the debate.", page: 2526 },
      { text: "It’s not a vote or a democracy. You’re not supposed to add up the numbers and find the average. But it provides all sorts of insight. I use it to collect candid feedback before making any important decision.", page: 2542 },
      { text: "The more you actively farm for dissent, and the more you encourage a culture of expressing disagreement openly, the better the decisions that will be made in your company.", page: 2543 },
      { text: "For smaller initiatives, you don’t need to farm for dissent, but you’d still be wise to let everyone know what you’re doing and to take the temperature of your initiative.", page: 2546 },
      { text: "Socializing is a type of farming for dissent with less emphasis on the dissent and more on the farming.", page: 2550 },
      { text: "The big difference at Netflix is that the tests take place even when those in charge are dead set against the initiative. The history behind Netflix and downloading is a clear example.", page: 2576 },
      { text: "Farm for dissent. Socialize the idea. Test it out. This sounds a lot like consensus building, but it’s not. With consensus building the group decides; at Netflix a person will reach out to relevant colleagues, but does not need to get anyone’s agreement before moving forward.", page: 2623 },
      { text: "For each important decision there is always a clear informed captain. That person has full decision-making freedom.", page: 2626 },
      { text: "part of the reason that F&R works so well is because people do feel the burden of the responsibility that comes with the freedom and make extra efforts accordingly.", page: 2643 },
      { text: "How you celebrate is up to you. The one thing you must do is show, ideally in public, that you are pleased she went ahead despite your doubts and offer a clear “You were right! I was wrong!” to show all employees it’s okay to buck the opinion of the boss.", page: 2676 },
      { text: "In 800 BC, Greek merchants whose businesses had failed were forced to sit in the marketplace with a basket over their heads.", page: 2680 },
      { text: "In seventeenth-century France, bankrupt business owners were denounced in the town square and, if they didn’t want to go straight to prison, had to endure the shame of wearing a green bonnet every time they went out in public.", page: 2681 },
      { text: "We suggest instead a three-part response: Ask what learning came from the project. Don’t make a big deal about it. Ask her to “sunshine” the failure.", page: 2690 },
      { text: "When a bet fails, the manager must be careful to express interest in the takeaways but no condemnation.", page: 2729 },
      { text: "First, if you take a bet and it fails, Reed will ask you what you learned. Second, if you try out something big and it doesn’t work out, nobody will scream—and you won’t lose your job.", page: 2730 },
      { text: "If you make a bet and it fails, it’s important to speak openly and frequently about what happened. If you’re the boss, make it clear you expect all failed bets to be detailed out in the open.", page: 2733 },
      { text: "It’s critical that your employees are continually hearing about the failed bets of others, so that they are encouraged to take bets (that of course might fail) themselves. You can’t have a culture of innovation if you don’t have this.", page: 2737 },
      { text: "In 2015, The New York Times reported that GE had, like Microsoft in 2012, dropped the evaluation method. As one might expect, stack ranking sabotages collaboration and destroys the joy of high-performing teamwork.", page: 3057 },
      { text: "We encourage our managers to apply the Keeper Test regularly. But we are very careful to not have any firing quotas or ranking system. Rank-and-yank or “you must let go of X percent of your people” is just the type of rule-based process that we try to avoid.", page: 3058 },
      { text: "During your next one-to-one with your boss ask the following question: “IF I WERE THINKING OF LEAVING, HOW HARD WOULD YOU WORK TO CHANGE MY MIND?” When you get the answer, you’ll know exactly where you stand.", page: 3099 },
      { text: "The best response after something difficult happens is to shine a bright light on the situation so everyone can work through it in the open. When you choose to sunshine exactly what happened, your clarity and openness will wash away the fears of the group.", page: 3146 },
      { text: "In order to encourage your managers to be tough on performance, teach them to use the Keeper Test: “Which of my people, if they told me they were leaving for a similar job at another company, would I fight hard to keep?”", page: 3176 },
      { text: "When you realize you need to let someone go, instead of putting him on some type of PIP, which is humiliating and organizationally costly, take all that money and give it to the employee in the form of a generous severance payment.", page: 3183 },
      { text: "We now do the 360 written feedback every year, asking each person to sign their comments. We no longer have employees rate each other on a scale of 1 to 5, since we don’t link the process to raises, promotions, or firings. The goal is to help everyone get better, not to categorize them into boxes.", page: 3291 },
      { text: "Length and location: A live 360 will take several hours. Do it over dinner (or at least include a meal) and keep the group small. We sometimes have sessions with ten or twelve people, but eight or fewer is more manageable. For a group of eight you’ll need about three hours. A group of twelve could run to five hours. Method: All feedback should be provided and received as an actionable gift following the 4A feedback guidelines outlined in chapter 2. The leader will need to explain this in advance and monitor it during the session. Positive actionable feedback (continue to . . .) is fine, but keep it in check. A good mix is 25 percent positive and 75 percent developmental (start doing . . . and stop doing . . .). Any nonactionable fluff (“I think you’re a great colleague” or “I love working with you”) should be discouraged and stamped out.", page: 3379 },
      { text: "Performance reviews are not the best mechanism for a candid work environment, primarily because the feedback usually goes only one way (down) and comes from only one person (the boss).", page: 3453 },
      { text: "A 360 written report is a good mechanism for annual feedback. But avoid anonymity and numeric ratings, don’t link results to raises or promotions, and open up comments to anyone who is ready to give them.", page: 3455 },
      { text: "Leading with context, on the other hand, is more difficult, but gives considerably more freedom to employees. You provide all of the information you can so that your team members make great decisions and accomplish their work without oversight or process controlling their actions.", page: 3519 },
      { text: "A tightly coupled system is one in which the various components are intricately intertwined. If you want to make a change to one area of the system, you have to go back and rework the foundation, which impacts not just the section you need to change, but the entire system.", page: 3618 },
      { text: "contrast, a loosely coupled design system has few interdependencies between the component parts.", page: 3620 },
      { text: "a loosely coupled design system has few interdependencies between the component parts. They are designed so that each can be adapted without going back and changing the foundation.", page: 3621 },
      { text: "If loose coupling is to work effectively, with big decisions made at the individual level, then the boss and the employees must be in lockstep agreement on their destination.", page: 3648 },
      { text: "North Star: the general direction we are running in. We don’t need to be aligned on how each department is going to get where they are going—that we leave to the individual areas—but we do need to make sure we are all moving in the same direction.", page: 3671 },
      { text: "WHEN ONE OF YOUR PEOPLE DOES SOMETHING DUMB DON’T BLAME THEM. INSTEAD ASK YOURSELF WHAT CONTEXT YOU FAILED TO SET. ARE YOU ARTICULATE AND INSPIRING ENOUGH IN EXPRESSING YOUR GOALS AND STRATEGY? HAVE YOU CLEARLY EXPLAINED ALL THE ASSUMPTIONS AND RISKS THAT WILL HELP YOUR TEAM TO MAKE GOOD DECISIONS? ARE YOU AND YOUR EMPLOYEES HIGHLY ALIGNED ON VISION AND OBJECTIVES?", page: 3693 },
      { text: "We’ve looked at over a dozen policies and processes that most companies have but that we don’t have at Netflix. These include: Vacation Policies Decision-Making Approvals Expense Policies Performance Improvement Plans Approval Processes Raise Pools Key Performance Indicators Management by Objective Travel Policies Decision Making by Committee Contract Sign-Offs Salary Bands Pay Grades Pay-Per-Performance Bonuses These are all ways of controlling people", page: 3905 },
      { text: "We soon learned that, although we can follow our mantra “Adequate Performance Gets a Generous Severance” in every country, what is considered generous in the US is often seen as stingy—if not illegal—in some European countries. In the Netherlands, for example, the amount of severance required by law depends on how long the employee has been with the company. So we had to adapt. Now in the Netherlands, if firing someone who’s been with us for a while, Adequate Performance Gets an Even More Generous Severance.", page: 3999 },
      { text: "as we increasingly hired employees around the world, we found that our obsession with investing every minute in the task was hurting us in myriad ways.", page: 4051 },
      { text: "The Thai manager learns never to criticize a colleague openly or in front of others, while the Israeli manager learns always to be honest and give the message straight. Colombians are trained to soften negative messages with positive words, while the French are trained to criticize passionately and provide positive feedback sparingly.", page: 4084 },
      { text: "The overarching lesson we’ve learned is that—no matter where you come from—when it comes to working across cultural differences, talk, talk, talk.", page: 4235 },
      { text: "Americans learn things like, “Always give three positives with every negative” and “Catch employees doing things right.” This is confusing for a Dutch person, who will give you positive feedback or negative feedback but is unlikely to do both in the same conversation.", page: 4251 },
      { text: "That’s what frustrates me about my American colleagues. As often as they give feedback and as eager as they are to hear it, if you don’t start by saying something positive they think the entire thing was a disaster. As soon as a Dutch person jumps in with the negative first, the American kills the critique by thinking the whole thing has gone to hell.", page: 4268 },
      { text: "The 4As are as follows: Aim to assist Actionable Appreciate Accept or decline", page: 4291 }
    ]
  },
  {
    title: "Butter Honey Pig Bread",
    author: "Francesca Ekwuyasi",
    coverImageUrl: "/book_covers/book6.jpg",
    description: "An interwoven multi-generational saga of three Nigerian women, examining the choices they make and the fractures that occur when family secrets are revealed.",
    link: "https://www.goodreads.com/en/book/show/51168133",
    highlights: [
      { text: "She sang with an abandon she typically reserved for her vices,", page: 2030 },
      { text: "None of her indulgences had yet silenced the shrill call of such a vast empty; still, she latched, she let go, she consumed, unhinged the jaw of her soul to drink whatever was given. And, still, nothing satiated.", page: 2231 }
    ]
  },
  {
    title: "In Praise of Shadows",
    author: "Junichiro Tanizaki",
    coverImageUrl: "/book_covers/book7.jpg",
    description: "An eloquent essay on Japanese aesthetics, exploring the use of light and darkness in architecture and art, contrasting it with Western preferences.",
    link: "https://www.theatlantic.com/magazine/archive/1955/01/in-praise-of-shadows-a-prose-elegy/641477/",
    highlights: [
      { text: "I have written all this because I have thought that there might still be somewhere, possibly in literature or the arts, where something could be saved. I would call back at least for literature this world of shadows we are losing. In the mansion called literature I would have the eaves deep and the walls dark, I would push back into the shadows the things that come forward too clearly, I would strip away the useless decoration. I do not ask that this be done everywhere, but perhaps we may be allowed at least one mansion where we can turn off the electric lights and see what it is like without them.", page: 42 },
      { text: "for Tanizaki a museum piece is no cause for rejoicing. An art must live as a part of our daily lives or we had better give it up. We can admire it for what it once was, and try to understand what made it so-as Tanizaki does in In Praise of Shadows-but to pretend that we can still participate in it is mere posturing.", page: 48 },
      { text: "We do our walls in neutral colors so that the sad, fragile, dying rays can sink into absolute repose. The storehouse, kitchen, hallways, and such may have a glossy finish, but the walls of the sitting room will almost always be of clay textured with fine sand. A luster here would destroy the soft fragile beauty of the feeble light.", page: null }
    ]
  },
  {
    title: "Amusing Ourselves to Death",
    author: "Neil Postman",
    coverImageUrl: "/book_covers/book8.jpg",
    description: "Neil Postman's classic critique of the television age, arguing that our obsession with entertainment is degrading our ability to engage in serious public discourse.",
    link: "https://www.penguinrandomhouse.com/books/297276/amusing-ourselves-to-death-by-neil-postman/",
    highlights: [
      { text: "To disdain rhetorical rules, to speak one's thoughts in a random manner, without proper emphasis or appropriate passion, was considered demeaning to the audience's intelligence and suggestive of falsehood", page: 22 },
      { text: ". My argument is limited to saying that a major new medium changes the structure of discourse; it does so by encouraging certain uses of the intellect, by favoring certain definitions of intelligence and wisdom, and by demanding a certain kind of content-in a phrase, by creating new forms. of truthtelling", page: 27 },
      { text: "We must be careful in praising or condemning because the future may hold surprises for us. The invention of the printing press itself is a paradigmatic example. Typography fostered the modern idea of individuality, but it destroyed the medieval sense of community and integration. Typography created prose but made poetry into an exotic and elitist form of expression. Typography made modern science possible but transformed religious sensibility into mere superstition. Typography assisted in the growth of the nation-state but thereby made patriotism into a sordid if not lethal emotion.", page: 29 },
      { text: "Think of Richard Nixon or Jimmy Carter or Billy Graham, or even Albert Einstein, and what will come to your mind is an image, a picture of a face, most likely a face on a television screen (in Einstein's case, a photograph of a face). Of words, almost nothing will come to mind. This is the difference between thinking in a wordcentered culture and thinking in an image-centered culture.", page: 61 },
      { text: "For two centuries, America declared its intentions, expressed its ideology, designed its laws, sold its products, created its literature and addressed its deities with black squiggles on white paper. It did its talking in typography, and with that as the main feature of its symbolic environment rose to prominence in world civilization", page: 63 },
      { text: "Exposition is a mode of thought, a method of learning, and a means of expression. Almost all of the characteristics we associate with mature discourse were amplified by typography, which has the strongest possible bias toward exposition: a sophisticated ability to think conceptually, deductively and sequentially; a high valuation of reason and order; an abhorrence of contradiction; a large capacity for detachment and objectivity; and a tolerance for delayed response. Toward the end of the nineteenth century, for reasons I am most anxious to explain, the Age of Exposition began to pass, and the early signs of its replacement could be discerned. Its replacement was to be the Age of Show Business.", page: 63 },
      { text: "Thus, we have here a great loop of impotence: The news elicits from you a variety of opinions about which you can do nothing except to offer them as more news, about which you can do nothing.", page: 69 },
      { text: "To the telegraph, intelligence meant knowing of lots of things, not knowing about them.", page: 70 },
      { text: "As Susan Sontag has observed, a photograph implies \"that we know about the world if we accept it as the camera records it.\"7 But, as she further observes, all understanding begins with our not accepting the world as it appears. Language, of course, is the medium we use to challenge, dispute, and cross-examine what comes into view, what is on the surface. The words true and false come from the universe of language, and no other.", page: 73 },
      { text: "crossword puzzle became a popular form of diversion in America at just that point when the telegraph and the photograph had achieved the transformation of news from functional infor mation to decontextualized fact. This coincidence suggests that the new technologies had turned the age-old problem of infor mation on its head: Where people once sought information to manage the real contexts of their lives, now they had to invent contexts in which otherwise useless information might be put to some apparent use", page: 76 },
      { text: "There is no more disturbing consequence of the electronic and graphic revolution than this: that the world as given to us through television seems natural, not bizarre.", page: 79 },
      { text: "I should go so far as to say that embedded in the surrealistic frame of a television news show is a theory of anticommunication, featuring a type of discourse that abandons logic, reason, sequence and rules of contradiction. In aesthetics, I believe the name given to this theory is Dadaism; in philosophy, nihilism; in psychiatry, schizophrenia. In the parlance of the theater, it is known as vaudeville", page: 105 },
      { text: "Robert MacNeil, executive editor and co-anchor of the MacNeilLehrer Newshour. The idea, he writes, \"is to keep everything brief, not to strain the attention of anyone but instead to provide constant stimularequired tion through variety, novelty, action, and movement. You are to pay attention to no concept, no character, and no problem for more than a few seconds at a time.\"2 He goes on to say that the assumptions controlling a news show are \"that bite-sized is best, that complexity must be avoided, that nuances are dispensable, that qualifications impede the simple message, that visual stimulation is a substitute for thought, and that verbal precision is an anachronism.\"", page: 105 },
      { text: ". Disinformation does not mean false information. It means misleading information-misplaced, irrelevant, fragmented or superficial information-information that creates the illusion of knowing something but which in fact leads one away from knowing. In saying this, I do not mean to imply that television news deliberately aims to deprive Americans of a coherent, contextual understanding of their world. I mean to say that when news is packaged as entertainment, that is the inevitable result", page: 107 },
      { text: "Huxley grasped, as Orwell did not, that it is not necessary to conceal anything from a public insensible to contradiction and narcoticized by technological diversions. Although Huxley did not specify that television would be our main line to the drug, he would have no difficulty accepting Robert MacNeil's observation that \"Television is the soma of Aldous Huxley's Brave New World.\" Big Brother turns out to be Howdy Doody.", page: 111 },
      { text: ". The spectacle we find in true religions has as its purpose enchantment, not entertainment. The distinction is critical. By endowing things with magic, enchantment is the means through which we may gain access to sacredness. Entertainment is the means through which we distance ourselves from it.", page: 122 },
      { text: ". Its principal theorists, even its most prosperous practitioners, believed capitalism to be based on the idea that both buyer and seller are sufficiently mature, well informed and reasonable to engage in transactions of mutual self-interest. If greed was taken to be the fuel of the capitalist engine, then surely rationality was the driver. The theory states, in part, that competition in the marketplace requires that the buyer not only knows what is good for him but also what is good. If the seller produces nothing of value, as determined by a rational marketplace, then he loses out. It is the assumption of rationality among buyers that spurs competitors to become winners, and winners to keep on winning. Where it is assumed that a buyer is unable to make rational decisions, laws are passed to invalidate transactions, as, for example, those which prohibit children from making contracts. In America, there even exists in law a requirement that sellers must tell the truth about their products, for if the buyer has no protection from false claims, rational decision-making is seriously impaired", page: 127 },
      { text: "The television commercial is not at all about the character of products to be consumed. It is about the character of the consumers of products.", page: 128 },
      { text: ". What the advertiser needs to know is not what is right about the product but what is wrong about the buyer. — And so, the balance of business expenditures shifts from product research to market research. The television commercial has oriented business away from making products of value and toward making consumers feel valuable, which means that the business of business has now become pseudotherapy. The consumer is a patient assured by psycho-dramas", page: 128 },
      { text: ". But the Founding Fathers did not foresee that tyranny by government might be superseded by another sort of problem altogether, namely, the corporate state, which through television now controls the flow of public discourse in America", page: 139 },
      { text: "Television is the new state religion run by a private Ministry of Culture (the three networks), offering a universal curriculum for all people, financed by a form of hidden taxation without representation. You pay when you wash, not when you watch, and whether or not you care to watch.... — — Earlier in the same essay, Gerbner said: — — yd Liberation cannot be accomplished by turning \\[television\\] off. — — Television is for most people the most attractive thing going any time of the day or night. We live in a world in which the vast majority will not turn off. If we don't get the message from the tube, we get it through other people.pl", page: 140 },
      { text: "To put it plainly, a student's freedom to read is not seriously injured by someone's banning a book on Long Island or in Anaheim or anyplace else. But as Gerbner suggests, television clearly does impair the student's freedom to read, and it does so with innocent hands, so to speak. Television does not ban books, it simply displaces them", page: 141 },
      { text: "Tyrants of all varieties have always known about the value of providing the masses with amusements as a means of pacifying discontent. But most of them could not have even hoped for a situation in which the masses would ignore that which does not amuse", page: 141 },
      { text: "television's principal contribution to educational philosophy is the idea that teaching and entertainment are inseparable. This entirely original conception is to be found nowhere in educational discourses, from Confucius to Plato to Cicero to Locke to John Dewey. In searching the literature of education, you will find it said by some that children will learn best when they are interested in what they are learning. You will find it said-Plato and Dewey emphasized thisthat reason is best cultivated when it is rooted in robust emotional ground. You will even find some who say that learning is best facilitated by a loving and benign teacher. But no one has ever said or implied that significant learning is effectively, durably and truthfully achieved when education is entertainment", page: 146 },
      { text: "Of all the enemies of television-teaching, including continuity and perplexity, none is more formidable than exposition. Arguments, hypotheses, discussions, reasons, refutations or any of the traditional instruments of reasoned discourse turn television into radio or, worse, third-rate printed matter. Thus, televisionteaching always takes the form of storytelling, conducted through dynamic images and supported by music", page: 148 },
      { text: "Stern reported that 51 percent of viewers could not recall a single item of news a few minutes after viewing a news program on television. Wilson found that the average television viewer could retain only 20 percent of the information contained in a fictional televised news story. Katz et al. found that 21 percent of television viewers could not recall any news items within one hour of broadcast. On the basis of his and other studies, Salomon has concluded that \"the meanings secured from television are more likely to be segmented, concrete and less inferential, and those secured from reading have a higher likelihood of being better tied to one's stored knowledge and thus are more likely to be inferential.\" In other words, so far as many reputable studies are concerned, television viewing does not significantly increase learning, is inferior to and less likely than print to cultivate higher-order, inferential thinking.", page: 152 },
      { text: "(One may also assume that what is called \"computer literacy\" does not involve raising questions about the cognitive biases and social effects of the computer, which, I would venture, are the most important questions to address about new technologies.)", page: 154 },
      { text: "And they will not rebel if their English teacher asks them to learn the eight parts of speech through the medium of rock music. Or if their social studies teacher sings to them the facts about the War of 1812. Or if their physics comes to them on cookies and T-shirts. Indeed, they will expect it and thus will be well prepared to receive their politics, their religion, their news and their commerce in the same delightful way.", page: 154 },
      { text: "An Orwellian world is much easier to recognize, and to oppose, than a Huxleyan. Everything in our background has prepared us to know and resist a prison when the gates begin to close around us. We are not likely, for example, to be indifferent to the voices of the Sakharovs and the Timmermans and the Walesas. We take arms against such a sea of troubles, buttressed by the spirit of Milton, Bacon, Voltaire, Goethe and Jefferson. But what if there are no cries of anguish to be heard? Who is prepared to take arms against a sea of amusements? To whom do we complain, and when, and in what tone of voice, when serious discourse dissolves into giggles? What is the antidote to a culture's being drained by laughter?", page: 156 },
      { text: "what is happening in America is not the design of an articulated ideology. No Mein Kampf or Communist Manifesto announced its coming. It comes as the unintended consequence of a dramatic change in our modes of public conversation. But it is an ideology nonetheless, for it imposes a way of life, a set of relations among people and ideas, about which there has been no consensus, no discussion and no opposition. Only compliance. Public consciousness has not yet assimilated the point that technology is ideology", page: 157 },
      { text: "Introduce speed-of-light transmission of images and you make a cultural revolution. Without a vote. Without polemics. Without guerrilla resistance. Here is ideology, pure if not serene. Here is ideology without words, and all the more powerful for their absence. All that is required to make it stick is a population that devoutly believes in the inevitability of progress. And in this sense, all Americans are Marxists, for we believe nothing if not that history is moving us toward some preordained paradise and that technology is the force behind that movement.", page: 157 },
      { text: "Television, as I have implied earlier, serves us most usefully when presenting junkentertainment; it serves us most ill when it co-opts serious modes of discourse-news, politics, science, education, commerce, religion and turns them into entertainment packages. We would all be better off if television got worse, not better.", page: 159 },
      { text: "The A-Team and Cheers are no threat to our public health. 60 Minutes, Eye-Witness News and Sesame Street are", page: 160 },
      { text: "Until, years from now, when it will be noticed that the massive collection and speedof-light retrieval of data have been of great value to large-scale organizations but have solved very little of importance to most people and have created at least as many problems for them as they may have solved.", page: 161 },
      { text: "The desperate answer is to rely on the only mass medium of communication that, in theory, is capable of addressing the problem: our schools. This is the conventional American solution to all dangerous social problems, and is, of course, based on a naive and mystical faith in the efficacy of education. The process rarely works. In the matter at hand, there is even less reason than usual to expect it to. Our schools have not yet even got around to examining the role of the printed word in shaping our culture. Indeed, you will not find two high school seniors in a hundred who could tell you-within a fivehundred-year margin of error-when the alphabet was invented", page: 162 },
      { text: "What I suggest here as a solution is what Aldous Huxley suggested, as well. And I can do no better than he. He believed with H. G. Wells that we are in a race between education and disaster, and he wrote continuously about the necessity of our understanding the politics and epistemology of media. For in the end, he was trying to tell us that what afflicted the people in Brave New World was not that they were laughing instead of thinking, but that they did not know what they were laughing about and why they had stopped thinking.", page: 163 },
      { text: "It is much later in the game now, and ignorance of the score is inexcusable. To be unaware that a technology comes equipped with a program for social change, to maintain that technology is neutral, to make the assumption that technology is always a friend to culture is, at this late hour, stupidity plain and simple", page: null }
    ]
  },
  {
    title: "Community",
    author: "Peter Block",
    coverImageUrl: "/book_covers/book9.jpg",
    description: "Peter Block outlines how to build strong communities by shifting the focus from problems and leaders to the power of citizen engagement and communal accountability.",
    link: "https://www.goodreads.com/en/book/show/2774428",
    highlights: [
      { text: "One key perspective is that to create a more positive and connected future for our communities, we must be willing to trade their problems for their Geography, hist tage, or any other fa possibilities. This trade is what is necessary to create a future for our cities marginal difference simply had to do wit and neighborhoods, organizations and institutions-a future that is distinct among its citizens. E Social capital is from the past. Which is the point.", page: 4 },
      { text: "Individual transformation is the more popular conversation, and the choice not to focus on it is because we have already learned that the transformation of large numbers of individuals does not result in the transformation of communities. If we continue to invest in individuals as the primary target of change, we will spend our primary energy on this and never fully invest in communities. Įn this way, individual transformation comes at the cost of community.", page: 5 },
      { text: "As Putnam and 3 Feldstein put it: \"\\[A\\] society that has onlybonding social capital will... \\[be\\] of a segregated into mutually hostile camps. So a pluralistic democracy requires lots of bridging social capital, not just the bonding variety.\"", page: 18 },
      { text: "3 Blas toward the future. — The insights from large group methods have a bias toward the future and devote little or no time to negotiating the past or emphasizing those areas where we will never agree anyway. The most organizing conversation starter is \"What do we want to create together?\" So much for in-depth diagnoses, more studies, argument and negotiation, and waiting for the sponsorship or transformation of top leaders. — — 4 How we engage matters. — The most important contribution of those who have developed these principles and insights is the idea that the way we bring people together matters more than our usual concerns about the content of what we present to people. How we structure the gathering is as worthy of attention as grasping the nature of a problem or focusing on the solutions that we seek.", page: 25 },
      { text: "Grameen Bank also counted on the power of community and related-é, ness. Yunus and his bank created teams of borrowers (they called them chapters), in which each person's ability to receive a loan was dependent on the repayment by others in the group. A portion of each repayment went to fund the loans to other chapters and the well-being of the community. These small groups were the basic unit of borrowing, four women to a group.", page: 27 },
      { text: "Conversations that focus on stories about the past become a limitation to community; ones that are teaching parables and focus on the future restore community.", page: 29 },
      { text: "We are a community of possibilities, not a community of problems. — — Community exists for the sake of belonging and takes its identity from the gifts, generosity, and accountability of its citizens. It is not defined by its fears, its isolation, or its penchant for retribution. — — We currently have all the capacity, expertise, programs, leaders, regulations, and wealth required to end unnecessary suffering and create an alternative future.", page: 30 },
      { text: "The stories that are useful and fulfilling are the ones that are metaphors, signposts, parables, and inspiration for the fullest expression of our humanity. They are communal teaching stories. Creation stories, wisdom stories, sometimes personal stories that have a mythic quality, even if they come from the person sitting next to me.", page: 35 },
      { text: "“ romanticizing leadership”The effect of buying in to this view of leadership is that it lets citizens off the hook and breeds citizen dependency and entitlement. It undermines a culture where each is accountable for their community. The attention on the leader makes good copy, it gives us someone to blame and thereby declares our innocence, but it does not contribute to building community. In its own way, it reinforces individualism, putting us in the stance of waiting for the cream to rise, wishing for a great individual to bring light where there was darkness.", page: 41 },
      { text: "Restorative community is created when we allow ourselves to use the language of healing and relatedness and belonging without embarrassment. It recognizes that taking responsibility for one's own part in creating the present situation is the critical act of courage and engagement, which is the axis around which the future rotates. The essence of restorative community building is not economic prosperity or the political discourse or the capacity of leadership; it is citizens' willingness to own up to their contribution, to be humble, to choose accountability, and to have faith in their own capacity to make authentic promises to create the alternative future.", page: 48 },
      { text: "A citizen is one who is willing to do the following: — — • Hold oneself accountable for the well-being of the larger collective of which we are a part. — • Choose to own and exercise power rather than defer or delegate it to others. — • Enter into a collective possibility that gives hospitable and restorative community its own sense of being. — •Acknowledge that community grows out of the possibility of citizens. Community is built not by specialized expertise, or great leadership, or improved services; it is built by great citizens. — •Attend to the gifts and capacities of all others, and act to bring the gifts of those on the margin into the center.", page: 65 },
      { text: "Questions with Little Power The existing conversation is organized around a set of traditional questions that have little power to create an alternative future. These are the questions the world is constantly asking. It is understandable that we ask them but they carry no power; and in the asking, each of these questions is an obsta cle to addressing what has given rise to the question in the first place: — — How do we get people to show up and be committed? — — How do we get others to be more responsible? — — How do we get people to come on board and to do the right thing? — — How do we hold those people accountable? — — How do we get others to buy in to our vision? — — How do we get those people to change? — — How much will it cost and where do we get the money? — — How do we negotiate for something better? — — What new policy or legislation will move our interests forwards Where is it working? Who has solved this elsewhere and how do We import that knowledge? — — How do we find and develop better leaders? — — Why aren't those people in the room?", page: 104 },
      { text: "A great question has three qualities: — — It is ambiguous. There is no attempt to try to precisely define what is meant by the question. This requires each person to bring their own, personal meaning into the room. — — It is personal. All passion, commitment, and connection grow out of what is most personal. We need to create space for the personal. — — It evokes anxiety. All that matters makes us anxious. It is our wish to escape from anxiety that steals our aliveness. If there is no edge to the question, there is no power.", page: 106 },
      { text: "￼ examples of Great questions — — What is the commitment you hold that brought you into this room? — — What is the price you or others pay for being here today? — — How valuable do you plan for this effort to be? — — What is the crossroads you face at this stage of the game? — — What is the story you keep telling about the problems of this community? — — What are the gifts you hold that have not been brought fully into the world? — — What is your contribution to the very thing you complain about? — — What is it about you or your team, group, or neighborhood that no one knows? — — These questions have the capacity to move something forward, and we will explore them-and others-in more depth in the coming chapters. By answering these kinds of questions, we become more accountable, more committed, more vulnerable; and when we voice our answers to one another, we grow more intimate and connected.", page: 106 },
      { text: "One of the basic elements of the relationship between oppressor and oppressed is prescription. Every prescription represents the imposition of one individual's choice upon another, transforming the consciousness of the person prescribed to into one that conforms with the prescriber's consciousness. — — Paolo Freire, The Pedagogy of the Oppressed", page: 109 },
      { text: "We need to tell people not to be helpful. Trying to be helpful and giving advice are really ways to control others. Advice is a conversation stopper. In community building, we want to substitute curiosity for advice. — No call to action. No asking what they are going to do about it. Do not tell people how you handled the same concern in the past. Do not ask questions that have advice hidden in them, such as \"Have you ever thought of talking to the person directly?\"", page: 109 },
      { text: "Constructing the Invitation The elements of invitation are the following: — — • Declare the possibility of the gathering • Frame the choice — • Name the hurdle — • Reinforce the request — • Decide on the most personal form possible", page: 119 },
      { text: "One key perspective is that to create a more positive and connected future for our communities, we must be willing to trade their problems for their possibilities. This trade is what is necessary to create a future for our cities and neighborhoods, organizations and institutions-a future that is distinct from the past. Which is the point.", page: null },
      { text: "The word structure means to build, to construct, to form, as well as the organization or morphology of the elements involved in the process. It can be seen as the embodiment of creation... a quest not only for form but also for purpose, direction and continuity.", page: null },
      { text: "I Accountability and commitment. — The essential insight is that people will be accountable and committed to what they have a hand in creating. This insight extends to the belief that whatever the world demands of us, the people most involved have the collective wisdom to meet the requirements of that demand. And if we can get them together in the room, in the right context and with a few simple ground rules, the wisdom to create a future or solve a problem is almost always in the room. All you need to ensure this is to make sure the people in the room are a diverse and textured summary of the power of their thinking: sample of the larger world you want to affect. This insight is an argument for collective intelligence and an argument against expensive studies and specialized expertise. That is why this thinking finds a skeptical ear from the academy, most expert consultants, and the leadership that espouses democracy but really only trusts patriarchy and cosmetic empowerment. — — 2 Learning from one another. — The key to gathering citizens, leaders, and stakeholders is to create in the room a living example of howI want the future to be. Then there is nothing to wait for, because the future begins to show up as we gather. One of the principles is that all voices need to be heard, but not necessarily all at one time or by everybody. What makes this succeed is that most everything important happens in a small group. Which expresses another principie, that peer-to-peer interaction is where most learning takes place, it is the fertile earth out of which something new is produced. In this small group you place the maximum mix of people's stories, values, and viewpoints, and in this way each group of 6 to 12 brings the whole system into that space.", page: null }
    ]
  },
  {
    title: "The Book of Disquiet",
    author: "Fernando Pessoa",
    coverImageUrl: "/book_covers/book10.jpg",
    description: "A 'factless autobiography' by Portuguese poet Fernando Pessoa, full of melancholic and philosophical reflections on life and existence.",
    link: "https://www.penguinrandomhouse.com/books/286380/the-book-of-disquiet-by-fernando-pessoa-edited-and-translated-by-richard-zenith/",
    highlights: [
      { text: "I’m astounded whenever I finish something. Astounded and distressed. My perfectionist instinct should inhibit me from finishing; it should inhibit me from even beginning. But I get distracted and start doing something. What I achieve is not the product of an act of my will but of my will’s surrender. I begin because I don’t have the strength to think; I finish because I don’t have the courage to quit. This book is my cowardice.", page: 65 },
      { text: "Each of us is several, is many, is a profusion of selves. So that the self who disdains his surroundings is not the same as the self who suffers or takes joy in them. In the vast colony of our being there are many species of people who think and feel in different ways.", page: 106 },
      { text: "Johnny-come-lately.", page: 169 },
      { text: "But more than anything else, it was existential concerns – operating on both a general and personal level – that subverted the initial project of The Book of Disquiet. On a general level, since The Book’s author belonged ‘to a generation that inherited disbelief in the Christian faith and created in itself a disbelief in all other faiths’. And since ‘we were left, each man to himself, in the desolation of feeling ourselves live’, the generational sense of lostness quickly became a personal struggle for identity and meaning (Text 306).", page: 201 },
      { text: "The semi-fiction called Soares, more than a justification or handy solution for this scattered Book, is an implied model for whoever has difficulty adapting to real, normal, everyday life. The only way to survive in this world is by keeping alive our dream, without ever fulfilling it, since the fulfilment never measures up to what we imagine – this was the closest thing to a message that Pessoa left, and he gave us Bernardo Soares to show us how it’s done.", page: 348 },
      { text: "To dream one’s life and to live one’s dreams, feeling what’s dreamed and what’s lived with an intensity so extreme it makes the distinction between the two meaningless – this credo echoed in nearly every reach of Pessoa’s universe, but Soares was its most practical example. While the other heteronymic stars talk about dreaming and feeling everything, Bernardo Soares actually has vivid, splendorous dreams and feels each tiny circumstance of his workaday life on the Rua dos Douradores. The post-Symbolist texts with misty forests, lakes, kings and palaces are crucial, for they are the imaginary substance, the very dreams of Soares, put into words. And the various ‘Rainy Landscapes’, with their excruciating descriptions of storms and winds, are illustrations of how to really feel the weather and, by extension, all of nature and the life that surrounds us.", page: 358 },
      { text: "Fairly tall and thin, he must have been about thirty years old. He hunched over terribly when sitting down but less so standing up, and he dressed with a carelessness that wasn’t entirely careless.", page: 500 },
      { text: "Night will fall on us all and the coach will pull up. I enjoy the breeze I’m given and the soul I was given to enjoy it with, and I no longer question or seek. If what I write in the book of travellers can, when read by others at some future date, also entertain them on their journey, then fine. If they don’t read it, or are not entertained, that’s fine too.", page: 573 },
      { text: "I have to choose what I detest – either dreaming, which my intelligence hates, or action, which my sensibility loathes; either action, for which I wasn’t born, or dreaming, for which no one was born. Detesting both, I choose neither; but since I must on occasion either dream or act, I mix the two things together.", page: 577 },
      { text: "Whenever I’ve tried to free my life from a set of the circumstances that continuously oppress it, I’ve been instantly surrounded by other circumstances of the same order, as if the inscrutable web of creation were irrevocably at odds with me. I yank from my neck a hand that was choking me, and I see that my own hand is tied to a noose that fell around my neck when I freed it from the stranger’s hand. When I gingerly remove the noose, it’s with my own hands that I nearly strangle myself.", page: 777 }
    ]
  },
  {
    title: "The Scent of Time",
    author: "Byung-Chul Han",
    coverImageUrl: "/book_covers/scent_of_time.jpeg",
    description: "In his latest book, Byung-Chul Han examines the art of lingering in the context of our time-compressed digital age, arguing for a return to a more contemplative and meaningful experience of time.",
    link: "https://www.politybooks.com/bookdetail?book_slug=the-scent-of-time-a-philosophical-essay-on-the-art-of-lingering--9781509516049",
    highlights: [
      { text: "Time tumbles on \\[stürzt fort\\], like an avalanche, precisely because it no longer contains anything to hold on to within itself. The tearing away of time,18 the directionless acceleration of processes (which, because of the lack of direction, is no longer really an acceleration at all), is triggered by those point-like presences between which there is no longer any temporal attraction. Acceleration in the proper sense of the word presupposes a course which directs the flow.", page: 321 },
      { text: "Promising, commitment and fidelity, for instance, are genuinely temporal practices. They bind the future by continuing the present into the future and linking the two, thus creating a temporal continuity that has a stabilizing effect. This continuity protects the future against the violence of non-time. Where the practice of long-term commitment (which is also a form of conclusion) gives way to increasing shorttermism, non-timeliness also increases, and is reflected at the psychological level in the form of anxiety and restlessness.", page: 347 },
      { text: "Torn time \\[Zeitriß\\], the radical discontinuity of time which does not allow for remembrance, leads to a torturous sleeplessness. The first passages of Proust’s novel, by contrast, present a gladdening experience of continuity, the mise en scène of an effortless hovering between sleeping, dreaming and awakening again, amidst a fluid medium made up of images belonging to memory and perception, a free to-and-fro between the past and present, between solid order and playful confusion.", page: 375 }
    ]
  },
  {
    title: "Gravity and Grace",
    author: "Simone Weil",
    coverImageUrl: "/book_covers/gravity_and_grace.jpeg",
    description: "First published posthumously in 1947, Gravity and Grace is a collection of Simone Weil's spiritual and philosophical aphorisms, exploring themes of suffering, detachment, and the search for the divine.",
    link: "https://www.nebraskapress.unl.edu/bison-books/9780803298002/gravity-and-grace/",
    highlights: [
      { text: "She fought in the ranks of the extreme left, but she never joined any political body, contenting herself with defending the weak and oppressed irrespective of party or race.", page: 205 },
      { text: "it would be harmful to her memory were the eternal and transcendent part of her message to be interpreted in the light of present-day politics and confused with party quarrels. No faction, no social ideology has the right to claim her. Her love of the people and her hatred of all oppression are not enough to place her among the leftists any more than her denial of progress and her cult for tradition authorize us to class her on the right. She put the same passionate enthusiasm into her political activities as into everything else, but far from making an idol of an idea, a nation or a class, she knew that the social field is above all the abode of what is relative and evil (‘to contemplate the social scene’, she wrote, ‘is as effective a purification as to withdraw from the world, and that is why I have not been wrong in mixing for so long a time in politics’).", page: 217 },
      { text: "No faction, no social ideology has the right to claim her. Her love of the people and her hatred of all oppression are not enough to place her among the leftists any more than her denial of progress and her cult for tradition authorize us to class her on the right. She put the same passionate enthusiasm into her political activities as into everything else, but far from making an idol of an idea, a nation or a class, she knew that the social field is above all the abode of what is relative and evil (‘to contemplate the social scene’, she wrote,", page: 218 },
      { text: "Germans. This idea of counterbalancing is essential in her conception of political and social activity: ‘If we know in what direction the scales of society are tilted we must do what we can to add weight to the lighter side. Although the weight may be something evil, if we handle it with this motive we shall perhaps not be tainted by it. But we must have a conception of equal balance and be always ready to i n t r o d u c t i o n xviii change sides like Justice—that fugitive from the camp of conquerors.’", page: 226 },
      { text: "she had a horror of being given privileges and fiercely shook herself free from any watchful care which aimed at raising her above the common level. She only felt at ease on the lowest rung of the social ladder, lost among the masses of poor folk and outcasts of this world.", page: 239 },
      { text: "‘We must welcome all opinions,’ she used to say, ‘but they must be arranged vertically and kept on suitable levels.’", page: 254 },
      { text: "there is this abrupt and final refutation of all such philosophers as Schopenhauer or Sartre who argue that the presence of evil in the world justifies a fundamental pessimism: ‘To say that the world is not worth anything, that this life is of no value, and to give evil as the proof is absurd, for if these things are worthless what does evil take from us?’", page: 267 },
      { text: "It is therefore a question of abolishing the self within us, ‘that shadow thrown by sin and error which stops the light of God and which we take for a being.’ Without this utter humility, this unconditional consent to be nothing, all forms of heroism and immolation are still subject to the law of gravity and falsehood: ‘We can offer nothing short of ourselves. Otherwise what we term our offering is merely a label attached to a compensatory assertion of the “I” ’.", page: 302 },
      { text: "In order to kill the self we must be ready to endure all the wounds of life, exposing ourselves naked and defenceless to its fangs, we must accept emptiness, an unequal balance, we must never seek compensations and, above all, we must suspend the work of our imagination, ‘which perpetually tends to stop up the cracks through which grace flows.’", page: 306 },
      { text: "So long as I hesitate between doing or not doing a bad action (for instance, possessing or not such and such a woman who offers herself to me, betraying or not betraying some friend), even if I choose the good I scarcely rise above the evil I reject. In order for my ‘good’ action to be really pure, I must dominate this miserable oscillation so that the righteousness of my outward behaviour is the exact expression of my inward necessity. Holiness is like degradation in this respect1; just as an utterly despicable man does not hesitate to", page: 353 },
      { text: "Everything that we want is in contradiction with the conditions or consequences which are attached to it. It is because we ourselves are a contradiction, being creatures, being God and infinitely other than God.’ Have countless children, for instance, and you are bringing about overpopulation and war (Japan is a typical case of this); improve the material conditions of a nation and you are in danger of impairing its soul; devote yourself entirely to someone and you will cease to exist for him, etc. Only imaginary good things have no contradiction in them: the girl who wants to have numerous offspring, the social reformer who dreams of the people’s well-being, etc., meet with no obstacles so long as they do not pass on to action; they sail gaily forward in a sea of pure but fictitious goodness; the shock of hitting the rocks is the inevitability of animal instincts. (‘I have become as a beast of burden before thy face’ . . .), detachment is like indifference, etc. i n t r o d u c t i o n xxvii signal which wakens them. We must accept this contradiction— the sign of our misery and our greatness—in all its bitterness. It is through fully experiencing and suffering from the absurdity as such of this universe where good and evil are mixed that we attain to the pure goodness whose kingdom is not of this world.", page: 368 },
      { text: "this thirst for pure goodness leads to the suffering of expiation; in a perfectly innocent soul it produces redemptive suffering: ‘To be innocent is to bear the weight of the whole universe. It is to throw in the i n t r o d u c t i o n xxviii counterweight to restore the balance.’ Thus purity does not abolish suffering; on the contrary it deepens it to infinity whilst giving it an eternal meaning: ‘The extreme greatness of Christianity lies in the fact that it does not seek a supernatural cure for suffering, but a supernatural use of it.’", page: 390 },
      { text: "of the law which generally puts force on the side of baseness.", page: 620 },
      { text: "The same action is easier if the motive is base than if it is noble. Base motives have in them more energy than noble ones. Problem: in what way can the energy belonging to the base motives be transferred to the noble ones?", page: 621 },
      { text: "I must not forget that at certain times when my headaches were g r a v i t y a n d g r a c e 3 raging I had an intense longing to make another human being suffer by hitting him in exactly the same part of his forehead. Analogous desires—very frequent in human beings. When in this state, I have several times succumbed to the temptation at least to say words which cause pain. Obedience to the force of gravity. The greatest sin. Thus we corrupt the function of language, which is to express the relationship between things.", page: 623 }
    ]
  },
  {
    title: "What Is Post-Branding?",
    author: "Jason Grant",
    coverImageUrl: "/book_covers/post_branding.jpg",
    description: "Part design experiment, part critical theory, part how-to manual, What Is Post-Branding? offers a creative counter to branding's neoliberal orthodoxy.",
    link: "https://www.artbook.com/9789083270678.html",
    highlights: [
      { text: "Branding is a key form of 'communicative capitalism' (Dean). Instead of exploited labour under industrial capitalism, now any act of communication (especially on monopolised digital platforms - a Google review, a tweet, an Instagram post) has the potential to become free labour that is brandable and transformable into economic value. It is this process which also destroys the meaningfulness of communication. Real political action and transformation is subverted by communicative capitalism exploiting communication. In this sense, abolishing branding is revolutionary.", page: 45 },
      { text: "In this world, when all you have is branding, everything looks like a brand. But if we stop framing basic human communication - and communication between actors whose primary motivation is not indefinite short term profit - as 'branding', we can more successfully promote our own values on our own terms.", page: 49 },
      { text: "To do branding is to obscure and reinforce hierarchies of privilege and class division. The branded, neoliberal unreal real is always constructed at the expense of the real real. Everyday political realities hide behind the rictus grin of a staged neoliberal reality - an endless enforced entrepreneurialism, where people's lives are shattered by a program of privatised, reduced or withdrawn essential social services and welfare support. Branding, as a weapon of neoliberal instrumentality is complicit in embedding institutional inequality and disadvantage. — — For example, in our formerly working class neighbourhoods of West End in Brisbane, and St Kilda in Melbourne (Turrbal & Yuggera and Boon Wurrung land long before that), all the messy contradictions of rapid gentrification, such as evictions, homelessness, violence, substance abuse and addiction, the shrinking of the public realm and erosion of supportive community are utterly disregarded, and in effect denied and enabled by branding. Instead, we are presented with branded commercial development promoting vapid templates of frictionless aspirational cosmopolitanism.", page: 51 },
      { text: "For example, in our formerly working class neighbourhoods of West End in Brisbane, and St Kilda in Melbourne (Turrbal & Yuggera and Boon Wurrung land long before that), all the messy contradictions of rapid gentrification, such as evictions, homelessness, violence, substance abuse and addiction, the shrinking of the public realm and erosion of supportive community are utterly disregarded, and in effect denied and enabled by branding. Instead, we are presented with branded commercial development promoting vapid templates of frictionless aspirational cosmopolitanism.", page: 51 },
      { text: "Branding can be a product of debt as a primary instrument of social control. In an indebted world people are forced into a precarious existence. Under these conditions people become 24/7 one person enterprises. The 'entrepreneur of the self' creates themself as a brand. Social media exploits this. Facebook, as the biggest advertising medium in human history, is a perfect example. Many Facebook users are carefully curating themselves as brands.", page: 53 },
      { text: "What branding doesn't capture through its spectacular media presence it conquers through addiction. — — It is complicit in the ever-increasing precarity of workers, as tenuous short-term contracts leave people with few choices other than to self-brand. Rather than making workers less precarious, this merely teases economic benefit. The curation of the self-brand is a constant task performed largely through 'digital housekeeping'. What we post, what we like, who we connect with, and what we share becomes our brand.", page: 55 },
      { text: "These self-branding activities are enforced by technology designed to exploit our longing for experiencing pleasure. Because pleasure is an episodic phenomenon - it never lasts long - we try to reinforce and repeat actions which give us pleasure. Tiny bits of pleasure, which we experience if our posts get liked and shared, glue us to the screen. The extent and the nature of our engagement with these technologies determines our addiction. When we are worthless in the market, self-branding generates an illusion of self-worth. And capitalism sells the limitless engagement with such technology as 'freedom'.", page: 55 },
      { text: "Branding is not isolated. It is a product, symptom and catalyst of capitalism. But creating meaning around signifiers, through a process of meaningful exchange like communication does not have to be predatory. — — Can we imagine an alternative method of communicating collective identity that supports the common good? Can we abandon the brandwagon? Can we imagine post-branding? — — Though branders may dismiss it as 'utopian', or 'naive', or as an 'activist aesthetic', post-branding is a change at the root of how and what we know - how we imagine the world and do things in it as designers. — — We need to wade through branding's shallow depths and simplistic complexities. Why is branding being taught in universities with no real alternative? Why are design awards rewarding branding? Is branding merely a compensation, an attempt to hype a terminally boring culture? — — Commercial forms of communication are based on 'external authority'. It is the image, the appearance as a brand and branding device which help legitimise and enable extractive cultures. Can we instead design as if all the world wasn't just a shopping mall and all its citizens targeted competitive consumers? A collective identity can create relations which include the interdependencies, needs and desires of a broad constituency, rather than the exclusive priorities of a minority corrupting power. — — Post-branding is new set of strategies embedded in a new culture of craft. A new way of being and knowing, for a new way of relating with the world.", page: 61 },
      { text: "Can we imagine an alternative method of communicating collective identity that supports the common good? Can we abandon the brandwagon? Can we imagine post-branding? — — Though branders may dismiss it as 'utopian', or 'naive', or as an 'activist aesthetic', post-branding is a change at the root of how and what we know - how we imagine the world and do things in it as designers. We need to wade through branding's shallow depths and simplistic complexities. Why is branding being taught in universities with no real alternative? Why are design awards rewarding branding? Is branding merely a compensation, an attempt to hype a terminally boring culture?", page: 61 },
      { text: "Because post-branding sees the public sphere as inherently open, participatory and democratic, our role as designers is to guard these principles through our work.Designing identities is seen as a collective articulation of issues, needs and futures, and our work needs to focus on building these emancipatory alternative worlds.", page: 180 },
      { text: "In opposition to branding, post-branding aims to avoid producing extractive relations. At the start of every postbranding project is an evaluation about who we are working with. While professional designers can apply post-branding in their practice - supporting organisations working across different sectors in society - post-branding, by definition, can't be done for clients and causes that harm our world.", page: 180 },
      { text: "Disnovation.org have conceived The Museum of Failures as a \"contributive museum\", dedicated to the dark and underrepresented narratives about technology. They write: — \"Progress, innovation and linear growth are cornerstones of our contemporary economies, social systems, even personal faith and belief. The very prevalence of these models and values requires that we unearth, create and circulate alternative, counter-narrative and parallel accounts.\"", page: 229 },
      { text: "chainworkers.org \\[see ecn.org/chainworkers/chainw/english.htm\\], for example. But whether it's the most interesting approach depends a lot on what you mean by \"communication.\" At a certain level culturejamming becomes a kind of virtuoso sport, declining into late Adbusters, and you start to see the mirror image relation between the two opposing teams, sparring for the excitement and prestige of manipulating people's emotions.", page: 239 },
      { text: "What is now clear to many is that under neoliberal governance, volunteer organizations are called into disaster areas to do the social work that the corporations don't want to pay for. Though some people within the humanitarian NGOs themselves are quite critical of this, their organizational form and the scales at which they operate make national and international agencies their only real partner. And so they are caught within the form of transnational governance that capital has done so much to create. — — I mean no harm to the people who tend the world's wounds, but I do believe that if we ever want to get out of this damaging model of predatory globalization, if we ever want to bring back a notion and a realization of substantial equality - the right to food, health care, education, livelihood, and simply to peace - then we have to change the fundamental conditions of statistically averaged communication, which has proven its ability to successfully reproduce exactly the current form of society. A society that includes people only as passive consumers - of charity or whatever - while it simultaneously excludes other people as no more than trash. How do you resist the very logic of that society?", page: 244 },
      { text: "Don't sell your conscience; don't sell your Conscience — As no money, no money, no money, no money, — no money can buy good name — Good name is better than silver and gold — And no money, no money, no money, no money, no money can buy good name — — William Onyeabor, Good Name, Wilfilms Records, 1983", page: 267 }
    ]
  },
  {
    title: "Rework",
    author: "Jason Fried & David Heinemeier Hansson",
    coverImageUrl: "/book_covers/rework.jpg",
    description: "Jason Fried and David Heinemeier Hansson challenge traditional business wisdom in Rework, offering a lean and pragmatic approach to starting and running a business.",
    link: "https://williammeller.com/rework-by-jason-fried-david-heinemeier-hansson/",
    highlights: [
      { text: "cringe. Internet companies are known for hiring compulsively,", page: 165 },
      { text: "and documents) is that they create illusions of agreement. A hundred people can read the same words, but in their heads, they’re imagining a hundred different things. That’s why you want to get to something real right away. That’s when you get true understanding. It’s like when", page: 711 },
      { text: "rather than a long one that’s", page: 886 },
      { text: "Start getting into the habit of saying no—even to many of your best ideas. Use the power of no to get your priorities straight. You rarely regret saying no. But you often wind up regretting saying yes.", page: 1034 },
      { text: "Don’t be a jerk about saying no, though. Just be honest. If you’re not willing to yield to a customer request, be polite and explain why. People are surprisingly understanding when you take the time to explain your point of view. You may even win them over to your way of thinking. If not, recommend a competitor if you think there’s a better solution out there. It’s better to have people be happy using someone else’s product than disgruntled using yours.", page: 1045 },
      { text: "When you stick with your current customers come hell or high water, you wind up cutting yourself off from new ones. Your product or service becomes so tailored to your current customers that it stops appealing to fresh blood. And that’s how your company starts to die.", page: 1056 },
      { text: "When you let customers outgrow you, you’ll most likely wind up with a product that’s basic—and that’s fine. Small, simple, basic needs are constant. There’s an endless supply of customers who need exactly that.", page: 1063 },
      { text: "You can’t be everything to everyone. Companies need to be true to a type of customer more than a specific individual customer with changing needs.", page: 1066 },
      { text: "The enthusiasm you have for a new idea is not an accurate indicator of its true worth. What seems like a sure-fire hit right now often gets downgraded to just a “nice to have” by morning. And “nice to have” isn’t worth putting everything else on hold.", page: 1071 },
      { text: "These early days of obscurity are something you’ll miss later on, when you’re really under the microscope. Now’s the time to take risks without worrying about embarrassing yourself.", page: 1116 },
      { text: "So build an audience. Speak, write, blog, tweet, make videos—whatever. Share information that’s valuable and you’ll slowly but surely build a loyal audience. Then when you need to get the word out, the right people will already be listening.", page: 1132 },
      { text: "So talk like you really talk. Reveal things that others are unwilling to discuss. Be upfront about your shortcomings. Show the latest version of what you’re working on, even if you’re not done yet. It’s OK if it’s not perfect. You might not seem as professional, but you will seem a lot more genuine.", page: 1185 },
      { text: "Forget about Time, Forbes, Newsweek, Business Week, the New York Times, and the Wall Street Journal. Pitching a reporter at one of these places is practically impossible. Good luck even getting ahold of that guy. And even if you do, he probably won’t care anyway. You’re not big enough to matter.", page: 1205 },
      { text: "Do you have a marketing department? If not, good. If you do, don’t think these are the only people responsible for marketing. Accounting is a department. Marketing isn’t. Marketing is something everyone in your company is doing 24/7/365.", page: 1227 },
      { text: "remember, great brands launch without PR campaigns all the time. Starbucks, Apple, Nike, Amazon, Google, and Snapple all became great brands over time, not because of a big PR push upfront.", page: 1253 },
      { text: "Never hire anyone to do a job until you’ve tried to do it yourself first. That way, you’ll understand the nature of the work. You’ll know what a job well done looks like. You’ll know how to write a realistic job description and which questions to ask in an interview. You’ll know whether to hire someone full-time or part-time, outsource it, or keep doing it yourself (the last is preferable, if possible).", page: 1262 },
      { text: "you should want to be intimately involved in all aspects of your business. Otherwise you’ll wind up in the dark, putting your fate solely in the hands of others. That’s dangerous.", page: 1271 },
      { text: "Hire a ton of people rapidly and a “strangers at a cocktail party” problem is exactly what you end up with. There are always new faces around, so everyone is unfailingly polite. Everyone tries to avoid any conflict or drama. No one says, “This idea sucks.” People appease instead of challenge.", page: 1295 },
      { text: "Bottom line: The pool of great candidates is far bigger than just people who completed college with a stellar GPA. Consider dropouts, people who had low GPAs, community-college students, and even those who just went to high school.", page: 1347 },
      { text: "With a small team, you need people who are going to do work, not delegate work. Everyone’s got to be producing. No one can be above the work.", page: 1350 },
      { text: "Delegators love to pull people into meetings, too. In fact, meetings are a delegator’s best friend. That’s where he gets to seem important. Meanwhile, everyone else who attends is pulled away from getting real work done.", page: 1354 },
      { text: "It’s crazy not to hire the best people just because they live far away. Especially now that there’s so much technology out there making it easier to bring everyone together online.", page: 1374 },
      { text: "To make sure your remote team stays in touch, have at least a few hours a day of real-time overlap. Working in time zones where there’s no workday overlap at all is tough. If you face that situation, someone might need to shift hours a bit so they start a little later or earlier in the day, so you’re available at the same time. You don’t need eight hours of overlap, though. (Actually, we’ve found it preferable to not have complete overlap—you get more alone time that way.) Two to four hours of overlap should be plenty.", page: 1377 },
      { text: "Geography just doesn’t matter anymore. Hire the best talent, regardless of where it is.", page: 1384 },
      { text: "Getting back to people quickly is probably the most important thing you can do when it comes to customer service. It’s amazing how much that can defuse a bad situation and turn it into a good one.", page: 1433 },
      { text: "A good apology accepts responsibility. It has no conditional if phrase attached. It shows people that the buck stops with you. And then it provides real details about what happened and what you’re doing to prevent it from happening again. And it seeks a way to make things right.", page: 1447 },
      { text: "Listening to customers is the best way to get in tune with a product’s strengths and weaknesses.", page: 1471 },
      { text: "After you introduce a new feature, change a policy, or remove something, knee-jerk reactions will pour in. Resist the urge to panic or make rapid changes in response. Passions flare in the beginning. That’s normal. But if you ride out that first rocky week, things usually settle down.", page: 1486 },
      { text: "Also, remember that negative reactions are almost always louder and more passionate than positive ones. In fact, you may hear only negative voices even when the majority of your customers are happy about a change. Make sure you don’t foolishly backpedal on a necessary but controversial decision.", page: 1494 },
      { text: "Culture is the byproduct of consistent behavior. If you encourage people to share, then sharing will be built into your culture. If you reward trust, then trust will be built in. If you treat customers right, then treating customers right becomes your culture.", page: 1512 },
      { text: "Culture isn’t a foosball table or trust falls. It isn’t policy. It isn’t the Christmas party or the company picnic. Those are objects and events, not culture. And it’s not a slogan, either. Culture is action, not words.", page: 1515 },
      { text: "It’s easy to shoot down good ideas, interesting policies, or worthwhile experiments by assuming that whatever you decide now needs to work for years on end. It’s just not so, especially for a small business. If circumstances change, your decisions can change. Decisions are temporary.", page: 1522 },
      { text: "We’re all capable of bad, average, and great work. The environment has a lot more to do with great work than most people realize.", page: 1534 },
      { text: "star power in anyone with a rock star environment. But there’s a ton of untapped potential trapped under lame policies, poor direction, and stifling bureaucracies. Cut the crap and you’ll find that people are waiting to do great work. They just need to be given the chance.", page: 1535 },
      { text: "Rockstar environments develop out of trust, autonomy, and responsibility.", page: 1539 },
      { text: "When everything constantly needs approval, you create a culture of nonthinkers. You create a boss-versus-worker relationship that screams, “I don’t trust you.”", page: 1545 },
      { text: "You don’t need more hours; you need better hours.", page: 1558 },
      { text: "As the saying goes, “If you want something done, ask the busiest person you know.” You want busy people. People who have a life outside of work. People who care about more than one thing. You shouldn’t expect the job to be someone’s entire life—at least not if you want to keep them around for a long time.", page: 1561 },
      { text: "Policies are organizational scar tissue. They are codified overreactions to situations that are unlikely to happen again. They are collective punishment for the misdeeds of an individual.", page: 1566 },
      { text: "No one sets out to create a bureaucracy. They sneak up on companies slowly. They are created one policy—one scar—at a time. So don’t scar on the first cut. Don’t create a policy because one person did something wrong once. Policies are only meant for situations that come up over and over again.", page: 1568 },
      { text: "Don’t talk about “monetization” or being “transparent;” talk about making money and being honest. Don’t use seven words when four will do.", page: 1581 },
      { text: "Easy. Easy is a word that’s used to describe other people’s jobs. “That should be easy for you to do, right?” But notice how rarely people describe their own tasks as easy. For you, it’s “Let me look into it”—but for others, it’s “Get it done.”", page: 1602 },
      { text: "These four-letter words often pop up during debates (and also watch out for their cousins: everyone, no one, always, and never). Once uttered, they make it tough to find a solution. They box you into a corner by pitting two absolutes against each other. That’s when head-butting occurs. You squeeze out any middle ground.", page: 1605 },
      { text: "“We need to add this feature now. We can’t launch without this feature. Everyone wants it. It’s only one little thing so it will be easy. You should be able to get it in there fast!” Only thirty-six words, but a hundred assumptions. That’s a recipe for disaster.", page: 1608 },
      { text: "When you turn into one of these people who adds ASAP to the end of every request, you’re saying everything is high priority. And when everything is high priority, nothing is. (Funny how everything is a top priority until you actually have to prioritize things.)", page: 1613 },
      { text: "If a task doesn’t get done this very instant, nobody is going to die. Nobody’s going to lose their job. It won’t cost the company a ton of money. What it will do is create artificial stress, which leads to burnout and worse. So reserve your use of emergency language for true emergencies. The kind where there are direct, measurable consequences to inaction. For everything else, chill out.", page: 1617 },
      { text: "If you’re inspired on a Friday, swear off the weekend and dive into the project. When you’re high on inspiration, you can get two weeks of work done in twenty-four hours. Inspiration is a time machine in that way.", page: 1626 },
      { text: "Inspiration is a magical thing, a productivity multiplier, a motivator. But it won’t wait for you. Inspiration is a now thing. If it grabs you, grab it right back and put it to work.", page: 1628 }
    ]
  },
  {
    title: "On the Shortness of Life",
    author: "Seneca",
    coverImageUrl: "/book_covers/shortness_of_life.jpg",
    description: "Seneca's timeless essay on the value of time and the importance of living a purposeful and intentional life, free from the distractions of ambition and leisure.",
    link: "https://www.goodreads.com/book/show/58649040-on-the-shortness-of-life",
    highlights: [
      { text: "It was this that made the greatest of physicians exclaim that \"life is short, art is long; — Seneca on the shortness of life ￼", page: 1 },
      { text: "\"The part of life we really live is small.\"5 For all the rest of existence is not life, but merely time. Vices beset us and surround us on every side, and they do not permit us to rise anew and lift up our eyes for the discernment of truth, but they keep us down when once they have overwhelmed us and we are chained to lust", page: 3 }
    ]
  },
  {
    title: "Governing the Commons",
    author: "Elinor Ostrom",
    coverImageUrl: "/book_covers/governing_commons.jpg",
    description: "In this seminal work, Elinor Ostrom explores how traditional communities manage collective resources without top-down regulation or privatization, offering a powerful alternative to the 'tragedy of the commons'.",
    link: "https://www.abebooks.com/servlet/BookDetailsPL?bi=22912392178&dest=usa&ref_=ps_ms_267691761&cm_mmc=msn-_-comus_dsa-_-naa-_-naa&msclkid=796b7dc5145e1098cc261471692c291f",
    highlights: [
      { text: "Therein is the tragedy. Each man is locked into a system that compels him to increase his herd without limit – in a world that is limited. Ruin is the destination toward which all men rush, each pursuing his own best interest in a society that believes in the freedom of the commons. (Hardin 1968, p. 1,244)", page: 301 },
      { text: "Aristotle long ago observed that “what is common to the greatt:st number has the least care bestowed upon it. Everyone thinks chiefly of his own, hardly at all of the common interest” (Politics, Book II, ch. 3).", page: 304 },
      { text: "At the heart of each of these models is the free-rider problem. Whenever one person cannot be excluded from the benefits that others provide, each person is motivated not to contribute to the joint effort, but to free-ride on the efforts of others. If all participants choose to free-ride, the collective benefit will not be produced.", page: 377 }
    ]
  },
  {
    title: "On Photography",
    author: "Susan Sontag",
    coverImageUrl: "/book_covers/on_photography.jpg",
    description: "Susan Sontag's collection of essays examining the aesthetic and moral problems raised by the presence and authority of the photographed image in modern life.",
    link: "https://www.penguin.com.au/books/on-photography-9780141035789",
    highlights: [
      { text: "To photograph is to appropriate the thing photographed. It means putting oneself into a certain relation to the world that feels like knowledge—and, therefore, like power.", page: 51 },
      { text: "Using a camera appeases the anxiety which the work-driven feel about not working when they are on vacation and supposed to be having fun. They have something to do that is like a friendly imitation of work: they can take pictures.", page: 135 },
      { text: "No longer toy images, photographs became part of the general furniture of the environment—touchstones and confirmations of that reductive approach to reality which is considered realistic.", page: 292 },
      { text: "Photographs, which cannot themselves explain anything, are inexhaustible invitations to deduction, speculation, and fantasy.", page: 313 },
      { text: "Photography implies that we know about the world if we accept it as the camera records it. But this is the opposite of understanding, which starts from not accepting the world as it looks. All possibility of understanding is rooted in the ability to say no.", page: 314 },
      { text: "Needing to have reality confirmed and experience enhanced by photographs is an aesthetic consumerism to which everyone is now addicted.", page: 327 },
      { text: "Industrial societies turn their citizens into image-junkies; it is the most irresistible form of mental pollution. Poignant longings for beauty, for an end to probing below the surface, for a redemption and celebration of the body of the world—all these elements of erotic feeling are affirmed in the pleasure we take in photographs", page: 328 },
      { text: "Steichen’s choice of photographs assumes a human condition or a human nature shared by everybody. By purporting to show that individuals are born, work, laugh, and die everywhere in the same way, “The Family of Man” denies the determining weight of history—of genuine and historically embedded differences, injustices, and conflicts.", page: 425 },
      { text: "The photographer is always trying to colonize new experiences or find new ways to look at familiar subjects—to fight against boredom.", page: 545 },
      { text: "somewhere, that America was not the grave of the Occident.”", page: 628 },
      { text: "What we have left of Whitman’s discredited dream of cultural revolution are paper ghosts and a sharp-eyed witty program of despair.", page: 634 },
      { text: "Social misery has inspired the comfortably-off with the urge to take pictures, the gentlest of predations, in order to document a hidden reality, that is, a reality hidden from them.", page: 700 },
      { text: "The photographer is an armed version of the solitary walker reconnoitering, stalking, cruising the urban inferno, the voyeuristic stroller who discovers the city as a landscape of voluptuous extremes. Adept of the joys of watching, connoisseur of empathy, the flâneur finds the world “picturesque.” The findings of Baudelaire’s flâneur are variously exemplified by the candid snapshots taken in the 1890s by Paul Martin in London streets and at the seaside and by Arnold Genthe in San Francisco’s Chinatown (both using a concealed camera), by Atget’s twilight Paris of shabby streets and decaying trades, by the dramas of sex and loneliness depicted in Brassai’s book Paris de nuit (1933), by the image of the city as a theater of disaster in Weegee’s Naked City (1945). The flâneur is not attracted to the city’s official realities but to its dark seamy corners, its neglected populations—an unofficial reality behind the façade of bourgeois life that the photographer “apprehends,” as a detective apprehends a criminal.", page: 705 },
      { text: "Americans, less convinced of the permanence of any basic social arrangements, experts on the “reality” and inevitability of change, have more often made photography partisan. Pictures got taken not only to show what should be admired but to reveal what needs to be confronted, deplored—and fixed up.", page: 809 },
      { text: "Photographs, which turn the past into a consumable object, are a short cut. Any collection of photographs is an exercise in Surrealist montage and the Surrealist abbreviation of history.", page: 885 },
      { text: "are clouds of fantasy and pellets of information. Photography has become the quintessential art", page: 895 },
      { text: "Photography has become the quintessential art of affluent, wasteful, restless societies —an indispensable tool of the new mass culture that took shape here after the Civil War, and conquered Europe only after World War II, although its values had gained a foothold among the well-off as early as the 1850s when, according to the splenetic description of Baudelaire, “our squalid society” became narcissistically entranced by Daguerre’s “cheap method of disseminating a loathing for history.”", page: 896 },
      { text: "In a world that is well on its way to becoming one vast quarry, the collector becomes someone engaged in a pious work of salvage. The course of modern history having already sapped the traditions and shattered the living wholes in which precious objects once found their place, the collector may now in good conscience go about excavating the choicer, more emblematic fragments.", page: 985 },
      { text: "Recall that it was Breton and other Surrealists who invented the secondhand store as a temple of vanguard taste and upgraded visits to flea markets into a mode of aesthetic pilgrimage. The Surrealist ragpicker’s acuity was directed to finding beautiful what other people found ugly or without interest and relevance—bric-a-brac, naïve or pop objects, urban debris.", page: 1023 },
      { text: "the habit of photographic seeing—of looking at reality as an array of potential photographs—creates estrangement from, rather than union with, nature.", page: 1236 },
      { text: "Photographic seeing, when one examines its claims, turns out to be mainly the practice of a kind of dissociative seeing, a subjective habit which is reinforced by the objective discrepancies between the way that the camera and the human eye focus and judge perspective.", page: 1238 },
      { text: "Socially concerned photographers assume that their work can convey some kind of stable meaning, can reveal truth. But partly because the photograph is, always, an object in a context, this meaning is bound to drain away; that is, the context which shapes whatever immediate—in particular, political—uses the photograph may have is inevitably succeeded by contexts in which such uses are weakened and become progressively less relevant. One of the central characteristics of photography is that process by which original uses are modified, eventually supplanted by subsequent uses —most notably, by the discourse of art into which any photograph can be absorbed.", page: 1352 },
      { text: "As Walter Benjamin observed in 1934, in an address delivered in Paris at the Institute for the Study of Fascism, the camera is now incapable of photographing a tenement or a rubbish-heap without transfiguring it. Not to mention a river dam or an electric cable factory: in front of these, photography can only say, ‘How beautiful.’ … It has succeeded in turning abject poverty itself, by handling it in a modish, technically perfect way, into an object of enjoyment.", page: 1364 },
      { text: "In fact, words do speak louder than pictures. Captions do tend to override the evidence of our eyes; but no caption can permanently restrict or secure a picture’s meaning.", page: 1384 },
      { text: "The caption is the missing voice, and it is expected to speak for truth. But even an entirely accurate caption is only one interpretation, necessarily a limiting one, of the photograph to which it is attached.", page: 1386 },
      { text: "Protected middle-class inhabitants of the more affluent corners of the world—those regions where most photographs are taken and consumed—learn about the world’s horrors mainly through the camera: photographs can and do distress. But the aestheticizing tendency of photography is such that the medium which conveys distress ends by neutralizing it. Cameras miniaturize experience, transform history into spectacle. As much as they create sympathy, photographs cut sympathy, distance the emotions. Photography’s realism creates a confusion about the real which is (in the long run) analgesic morally as well as (both in the long and in the short run) sensorially stimulating. Hence, it clears our eyes. This is the fresh vision everyone has been talking about.", page: 1397 },
      { text: "in the finest essay ever written in praise of photography, Paul Rosenfeld’s chapter on Stieglitz in Port of New York. By using “his machinery”—as Rosenfeld puts it —“unmechanically,” Stieglitz shows that the camera not only “gave him an opportunity of expressing himself” but supplied images with a wider and “more delicate” gamut “than the hand can draw.”", page: 1481 },
      { text: "solipsistic expression of the singular self.", page: 1531 },
      { text: "Photography, like pop art, reassures viewers that art isn’t hard; it seems to be more about subjects than about art.", page: 1647 }
    ]
  },
  {
    title: "The Tyranny of Virtue",
    author: "Robert Boyers",
    coverImageUrl: "/book_covers/tyranny_of_virtue.jpg",
    description: "Robert Boyers examines the culture of ideological fundamentalism and the hunt for 'heresy' in contemporary academia and public discourse, calling for a return to intellectual nuance and complexity.",
    link: "https://www.goodreads.com/en/book/show/43822430-the-tyranny-of-virtue",
    highlights: [
      { text: "The privilege craze is part of a new fundamentalism built on a willful refusal to accept that the most obvious features of our so-called identity are the least reliable indicators of what may reasonably be expected of us.", page: 410 },
      { text: "The good professor who characterized the offending letter and, by extension, its signatories as “divisive” and “demoralizing” was unwittingly giving voice to a sentiment widely shared in the American academic community. To challenge officially accredited views, particularly when those views have anything to do with sensitive issues, is now regarded as out of bounds, illegitimate, an expression of arrogance or entitlement, and thereby hostile.", page: 482 },
      { text: "The burning desire to paint a scarlet letter on the breast of those who fail to observe the officially sanctioned view of things has taken possession of many ostensibly liberal persons in the academy, which has tended more and more in recent years to resemble what the cultural critic David Bromwich calls “a church, held together by the hunt for heresies.”", page: 507 },
      { text: "When Donald Trump complains of the protocols and protections mandated to ensure that workplace and academic environments protect their citizens from flagrant abuse or intimidation, and declares these safeguards a laughable species of political correctness, we observe that he and his friends do not understand the relationship between freedom and responsibility, between open discussion and the civility that alone makes real discussion possible.", page: 548 },
      { text: "Nicholas Kristof of the New York Times argues that many liberals “want to be inclusive of people who don’t look like us—so long as they think like us.” On campuses across the country, according to Kristof, academics casually admit that “they would discriminate in hiring decisions” based on “the ideological views of a job applicant.” For many academics, the desire to cleanse the campus of dissident voices has become something of a mission.", page: 552 },
      { text: "As Wason and other psychological researchers note, academics tend to have higher-than-average IQs and are predictably “able to generate more reasons” to account for what they believe. But high-IQ people like academics typically produce “only \\[a greater\\] number of my-side arguments” and “are no better than others at finding reasons on the other side.” This is especially troubling—or ought to be especially troubling—in the culture of the university, where diversity of outlook and idea, and resistance to accredited formulas, is at least theoretically central to the institutional mission.", page: 582 },
      { text: "successful. As Cass Sunstein notes, “like-minded people \\[largely\\] insulated” from those with disparate views are apt to be moved by “parochial influences” and to insist upon talking “only to one another.”", page: 615 },
      { text: "Yang calls “the manner in which activists are seeking to win a debate—not through scholarship, persuasion, and debate . . . \\[but\\] through the subornation of administrative and disciplinary power to delegitimize, stigmatize, disqualify, surveil, forbid, shame, and punish holders of contrary views.”", page: 622 }
    ]
  },
  {
    title: "On Earth We're Briefly Gorgeous",
    author: "Ocean Vuong",
    coverImageUrl: "/book_covers/briefly_gorgeous.jpg",
    description: "A deeply moving and poetic novel written as a letter from a son to his illiterate mother, Ocean Vuong explores themes of memory, family, trauma, and the power of language.",
    link: "https://www.goodreads.com/book/show/41880609-on-earth- we-re-briefly-gorgeous",
    highlights: [
      { text: "Because freedom, I am told, is nothing but the distance between the hunter and its prey.", page: 107 },
      { text: "Ma. You once told me that memory is a choice. But if you were god, you’d know it’s a flood.", page: 1010 },
      { text: "beats punctuated by the sound of beer bottles bursting on the basketball court across the street, the crackheads lobbing the empties up in the sky, just to see how the streetlights make broken things seem touched by magic, glass sprinkled like glitter on the pavement come morning.", page: 1110 },
      { text: "There were colors, Ma. Yes, there were colors I felt when I was with him. Not words—but shades, penumbras.", page: 1363 },
      { text: "Afterward, lying next to me with his face turned away, he cried skillfully in the dark. The way boys do. The first time we fucked, we didn’t fuck at all.", page: 1481 },
      { text: "I did not know then what I know now: to be an American boy, and then an American boy with a gun, is to move from one end of a cage to another.", page: 1499 },
      { text: "Because something in him knew she’d be there. That she was waiting. Because that’s what mothers do. They wait. They stand still until their children belong to someone else.", page: 1635 },
      { text: "In a world myriad as ours, the gaze is a singular act: to look at something is to fill your whole life with it, if only briefly.", page: 2181 },
      { text: "You killed that poem, we say. You’re a killer. You came in to that novel guns blazing. I am hammering this paragraph, I am banging them out, we say. I owned that workshop. I shut it down. I crushed them. We smashed the competition. I’m wrestling with the muse. The state, where people live, is a battleground state. The audience a target audience. “Good for you, man,” a man once said to me at a party, “you’re making a killing with poetry. You’re knockin’ ’em dead.”", page: 2226 },
      { text: "I know. It’s not fair that the word laughter is trapped inside slaughter.", page: 2321 },
      { text: "The Greeks thought sex was the attempt of two bodies, separated long ago, to return to one life. I don’t know if I believe this but that’s what it felt like: as if we were two people mining one body, and in doing so, merged, until no corner was left saying I.", page: 2502 },
      { text: "To ask What’s good? was to move, right away, to joy. It was pushing aside what was inevitable to reach the exceptional. Not great or well or wonderful, but simply good. Because good was more often enough, was a precious spark we sought and harvested of and for one another.", page: 2660 },
      { text: "All freedom is relative—you know too well—and sometimes it’s no freedom at all, but simply the cage widening far away from you, the bars abstracted with distance but still there, as when they “free” wild animals into nature preserves only to contain them yet again by larger borders.", page: 2682 }
    ]
  },
  {
    title: "No Logo",
    author: "Naomi Klein",
    coverImageUrl: "/book_covers/no_logo.jpg",
    description: "Naomi Klein's seminal work on the rise of anti-corporate activism and the impact of global branding on culture and labor.",
    link: "https://www.goodreads.com/book/show/647.No_Logo",
    highlights: [
      { text: "Bush’s budget director Mitch Daniels said, “The general idea—that the business of government is not to provide services, but to make sure that they are provided—seems self-evident to me.”", page: 161 },
      { text: "when the financial system imploded in the fall of 2008 and the U.S. Treasury stepped in with a \\$700-billion bank bailout. Not only did it fail to attach meaningful strings to the money, but it announced that it did not have the capacity to administer the program. It needed to outsource the rescue of the banks to the very banks that created the disaster and were receiving the bailout funds.", page: 199 },
      { text: "By the end of eight years of self-immolation under Bush, the state still has all the trappings of a government—the impressive buildings, presidential press briefings, policy battles—but it no more did the actual work of governing than the employees at Nike’s Beaverton campus actually stitched running shoes. Governing, it seemed, was not its core competency.", page: 206 },
      { text: "This preference for symbols over substance, and this unwillingness to stick to a morally clear if unpopular course, is where Obama decisively parts ways with the transformative political movements from which he has borrowed so much (his pop-art posters from Che, his cadence from King, his “Yes We Can!” slogan from the migrant farmworkers’ Si Se Puede).", page: 287 },
      { text: "In the two months before the election, the financial crisis rocking world markets was being rightly blamed not just on the contagion of Wall Street’s bad bets but on the entire economic model of deregulation and privatization (called “neoliberalism” in most parts of the world) that had been preached from U.S.-dominated institutions like the International Monetary Fund and the World Trade Organization.", page: 309 },
      { text: "Obama didn’t just rebrand America, he resuscitated the neoliberal economic project when it was at death’s door. No one but Obama, wrongly perceived as a new FDR, could have pulled it off.", page: 317 },
      { text: "There was also the morning when I woke up and every billboard on my street had been “jammed” with anticorporate slogans by midnight bandits. And the fact that the squeegee kids who slept in the lobby of my building all seemed to be wearing homemade patches on their clothing with a Nike “swoosh” logo and the word “Riot.”", page: 492 },
      { text: "Stooping to compete on the basis of real value, the agencies ominously warned, would spell not just the death of the brand, but corporate death as well.", page: 719 },
      { text: "extra-premium “attitude” brands that provide the essentials of lifestyle and monopolize ever-expanding stretches of cultural space (Nike et al.).", page: 753 },
      { text: "Nike, for example, is leveraging the deep emotional connection that people have with sports and fitness. With Starbucks, we see how coffee has woven itself into the fabric of people’s lives, and that’s our opportunity for emotional leverage…. A great brand raises the bar—it adds a greater sense of purpose to the experience, whether it’s the challenge to do your best in sports and fitness or the affirmation that the cup of coffee you’re drinking really matters.", page: 806 },
      { text: "Advertising is about hawking product. Branding, in its truest and most advanced incarnations, is about corporate transcendence.", page: 817 },
      { text: "MTV itself: the first truly branded network. Though there have been dozens of imitators since, the original genius of MTV, as every marketer will tell you, is that viewers didn’t watch individual shows, they simply watched MTV. “As far as we were concerned, MTV was the star,” says Tom Freston, network founder.12 And so advertisers didn’t want to just advertise on MTV,", page: 1179 },
      { text: "Like so much of cool hunting, Hilfiger’s marketing journey feeds off the alienation at the heart of America’s race relations: selling white youth on their fetishization of black style, and black youth on their fetishization of white wealth.", page: 1753 },
      { text: "Going to Disney World to drop acid and goof on Mickey isn’t revolutionary; going to Disney World in full knowledge of how ridiculous and evil it all is and still having a great innocent time, in some almost unconscious, even psychotic way, is something else altogether. This is what de Certeau describes as “the art of being inbetween,” and this is the only path of true freedom in today’s culture. Let us, then, be in-between. Let us revel in Baywatch, Joe Camel, Wired magazine, and even glossy books about the society of spectacle \\[touché\\], but let’s never succumb to the glamorous allure of these things.", page: 1781 },
      { text: "for brands in search of cool new identities, irony and camp have become so all-purpose that they even work after the fact.", page: 1796 },
      { text: "These CEOs are the new rock stars—and why shouldn’t they be? Forever trailing the scent of cool, they are full-time, professional teenagers, but unlike real teenagers, they have nothing to distract them from the hot pursuit of the edge: no homework, puberty, college-entrance exams or curfews for them.", page: 1839 },
      { text: "just because a scene or style is different (that is, new and not yet mainstream), it necessarily exists in opposition to the mainstream, rather than simply sitting unthreateningly on its margins.", page: 1851 },
      { text: "Susan Sontag so brilliantly illuminated in her 1964 essay “Notes on Camp,” is based on an essential cliquiness, a club of people who get the aesthetic puns. “To talk about camp is therefore to betray it,”34 she acknowledges at the beginning of the essay, selecting the format of enumerated notes rather than a narrative so as to tread more lightly on her subject, one that could easily have been trampled with too heavy an approach.", page: 1876 },
      { text: "to determine whether a movement genuinely challenges the structures of economic and political power, one need only measure how affected it is by the goings-on in the fashion and advertising industries. If, even after being singled out as the latest fad, it continues as if nothing had happened, it’s a good bet it is a real movement.", page: 1915 },
      { text: "If we were not revolutionaries, why, then, were our opponents saying that a revolution was under way, that we were in the midst of a “culture war”? “The transformation of American campuses is so sweeping that it is no exaggeration to call it a revolution,” Dinesh D’Souza, author of Illiberal Education, informed his readers. “Its distinctive insignia can be witnessed on any major", page: 2314 },
      { text: "Daniel Mendelsohn has written that gay identity has dwindled into “basically, a set of product choices…. At least culturally speaking, oppression may have been the best thing that could have happened to gay culture. Without it, we’re nothing.” The nostalgia, of course, is absurd. Even the most cynical ID warrior will admit, when pressed, that having Ellen Degeneres and other gay characters out on TV has some concrete advantages. Probably it is good for the kids, particularly those who live outside of larger urban settings—in rural or small-town environments, where being gay is more likely to confine them to a life of self-loathing. (The attempted suicide rate in 1998 among gay and bisexual male teens in America was 28.1 percent, compared with 4.2 percent among straight males of the same age group.)", page: 2390 },
      { text: "The market has seized upon multiculturalism and gender-bending in the same ways that it has seized upon youth culture in general—not just as a market niche but as a source of new carnivalesque imagery.", page: 2407 },
      { text: "It was in this minefield that “diversity” marketing appeared, presenting itself as a cure-all for the pitfalls of global expansion. Rather than creating different advertising campaigns for different markets, campaigns could sell diversity itself, to all markets at once. The formula maintained the one-size-fits-all cost benefits of old-style cowboy cultural imperialism, but ran far fewer risks of offending local sensibilities.", page: 2449 },
      { text: "More than anything or anyone else, logo-decorated middle-class teenagers, intent on pouring themselves into a media-fabricated mold, have become globalization’s most powerful symbols.", page: 2469 },
      { text: "When the free-trade debate was lost, the left retreated even further into itself, choosing ever more minute disputes over which to go to the wall. This retreat reflected a broader political paralysis in the face of the daunting abstractions of global capitalism—ironically, the very issues that should have been most pressing for anyone concerned with the future of social justice.", page: 2558 },
      { text: "within these real and virtual branded edifices, options for unbranded alternatives, for open debate, criticism and uncensored art—for real choice—are facing new and ominous restrictions.", page: 2623 },
      { text: "as deep longing for the seductions of fake; I wanted to disappear into shiny, perfect, unreal objects.", page: 2828 },
      { text: "brands are about “meaning,” not product attributes, then the highest feat of branding comes when companies provide their consumers with opportunities not merely to shop but to fully experience the meaning of their brand.", page: 2878 },
      { text: "Tocqueville’s prediction: an “authenticity” bunker, specially retrofitted by the founder of fake.", page: 3056 },
      { text: "brandstravaganza", page: 3114 },
      { text: "in 1983, Reagan began the not-so-gradual dismantling of U.S. anti-trust laws, first opening the door to joint research between competitors, then removing the roadblocks to giant mergers. He yanked the teeth out of the Federal Trade Commission, dramatically limiting its ability to impose fines for anticompetitive actions, cutting the staff from 345 to 134 and appointing an FTC chairman who prided himself on reducing the agency’s “excessively adversarial role.”", page: 3176 },
      { text: "Products like Kraft Dinner, McCracken argues, take on a life of their own when they leave the store—they become pop-culture icons, vehicles for family bonding, and creatively consumed expressions of individuality.", page: 3407 },
      { text: "Harvard professor Susan Fournier, whose paper, “The Consumer and the Brand: An Understanding within the Framework of Personal Relationships,” encourages marketers to use a human-relationship model in conceptualizing the brand’s place in society: is it a wife through an arranged marriage? A best friend or a mistress? Do customers “cheat” on their brand or are they loyal? Is the relationship a “casual friendship” or a “master/slave engagement”? As Fournier writes, “this connection is driven not by the image the brand ‘contains’ in the culture, but by the deep and significant psychological and socio-cultural meanings the consumer bestows on the brand in the process of meaning creation.”20", page: 3410 },
      { text: "“brand disparagement” laws—easily abused statutes that form an airtight protective seal around the brand, allowing it to brand us, but prohibiting us from so much as scuffing it.", page: 3420 },
      { text: "The definition of trademark in U.S. law is “any word, name, symbol, or device, or combination thereof, used…to identify and distinguish goods from those manufactured or sold by others.” Many alleged violators of copyright are not trying to sell a comparable good or pass themselves off as the real thing. As branding becomes more expansionist, however, a competitor is anyone doing anything remotely related, because anything remotely related has the potential to be a spin-off at some point in the synergistic future.", page: 3422 },
      { text: "Artists will always make art by reconfiguring our shared cultural languages and references, but as those shared experiences shift from firsthand to mediated, and the most powerful political forces in our society are as likely to be multinational corporations as politicians, a new set of issues emerges that once again raises serious questions about out-of-date definitions of freedom of expression in a branded culture. In this context, telling video artists that they can’t use old car commercials, or musicians that they can’t sample or distort lyrics, is like banning the guitar or telling a painter he can’t use red. The underlying message is that culture is something that happens to you. You buy it at the Virgin Megastore or Toys ’R’ Us and rent it at Blockbuster Video. It is not something in which you participate, or to which you have the right to respond.", page: 3451 },
      { text: "When piled on together, such examples give a picture of corporate space as a fascist state where we all salute the logo and have little opportunity for criticism because our newspapers, television stations, Internet servers, streets and retail spaces are all controlled by multinational corporate interests.", page: 3615 },
      { text: "equipment—brands like Nike, the Gap and IBM are omnipresent, invisibly pulling all the strings. They are so powerful as buyers that the hands-on involvement owning the factories would entail has come to look, from their perspective, like needless micromanagement. And because the actual owners and factory managers are completely dependent on their large contracts to make the machines run, workers are left in a uniquely weak bargaining position: you can’t sit down and bargain with an order form. So even the classic Marxist division between workers and owners doesn’t quite work in the zone, since the brand-name multinationals have divested the “means of production,” to use Marx’s phrase, unwilling to encumber themselves with the responsibilities of actually owning and managing the factories, and employing a labor force.", page: 4257 },
      { text: "This internalized state of perpetual transience has been convenient for service-sector employers who have been free to let wages stagnate and to provide little room for upward mobility, since there is no urgent need to improve the conditions of jobs that everyone agrees are only temporary.", page: 4375 },
      { text: "in mid-1999 the fast-food chain launched an international television campaign featuring McDonald’s workers serving up shakes and fries under the captions “future lawyer,” “future engineer” and so on. Here was the true McDonald’s workforce, the company seemed to be saying: happy, contented and just passing through.", page: 4493 },
      { text: "But just as the service-sector employers will not admit that the youthfulness of their workforce might have something to do with the wages they pay and the security they fail to offer, you will never catch a television network or a publisher confessing that the absence of remuneration for internships might also have something to do with the relative privilege of those applying for these positions at their companies.", page: 4576 },
      { text: "out, the word “freelance” is derived from the age when mercenary soldiers rented themselves—and their lances—out for battle. “The free lancers roamed from assignment to assignment—killing people for money.”", page: 4776 },
      { text: "Writing in The Wall Street Journal, Kay points out that the exorbitant salaries American companies have taken to paying their CEOs is a “crucial factor making the U.S. economy the most competitive in the world” because without juicy bonuses company heads would have “no economic incentive to face up to difficult management decisions, such as layoffs.”", page: 4780 },
      { text: "What is emerging out of this growing trend of tying executive pay to stock performance is a corporate culture so damaged that workers must often be fired or shortchanged for the boss to get paid.", page: 4804 },
      { text: "Advertising men are indeed very unhappy these days, very nervous, with a kind of apocalyptic expectancy. Often when I have lunched with an agency friend, a half dozen worried copy writers and art directors have accompanied us. Invariably they want to know when the revolution is coming, and where will they get off if it does come. —Ex-adman James Forty, Our Master’s Voice, 1934", page: 5083 },
      { text: "He tells the police officer about how poor neighborhoods have a disproportionately high number of billboards selling tobacco and hard liquor products. He talks about how these ads always feature models sailing, skiing or playing golf, making the addictive products they promote particularly glamorous to kids stuck in the ghetto, longing for escape. Unlike the advertisers who pitch and run, he wants his work to be part of a community discussion about the politics of public space.", page: 5100 },
      { text: "anytime people mess with a logo, they are tapping into the vast resources spent to make that logo meaningful. Kalle Lasn, editor of Vancouver-based Adbusters magazine, uses the martial art of jujitsu as a precise metaphor to explain the mechanics of the jam. “In one simple deft move you slap the giant on its back. We use the momentum of the enemy.”", page: 5117 },
      { text: "The term “culture jamming” was coined in 1984 by the San Francisco audio-collage band Negativland. “The skillfully reworked billboard…directs the public viewer to a consideration of the original corporate strategy,”", page: 5126 },
      { text: "San Francisco’s Billboard Liberation Front (responsible for the Exxon and Levi’s jams) has been altering ads for twenty years,", page: 5143 },
      { text: "When Kalle Lasn says culture jamming has the feeling of “a bit of a fad,” he’s not exaggerating.26 It turns out that culture jamming—with its combination of hip-hop attitude, punk anti-authoritarianism and a well of visual gimmicks—has great sales potential.", page: 5410 },
      { text: "Sprite’s “Obey Your Thirst” campaign.", page: 5441 },
      { text: "“Advertising,” as George Orwell once said, “is the rattling of a stick inside a swill bucket.”", page: 5531 },
      { text: "As James Twitchell writes in Adcult USA, most advertising criticism reeks of contempt for the people who “want—ugh!—things.”37 Such a theory can never hope to form the intellectual foundation of an actual resistance movement against the branded life, since genuine political empowerment cannot be reconciled with a belief system that regards the public as a bunch of ad-fed cattle, held captive under commercial culture’s hypnotic spell. What’s the point of going through the trouble of trying to knock down the fence? Everyone knows the branded cows will just stand there looking dumb and chewing cud.", page: 5535 },
      { text: "There was a short-lived magazine published in New York called The Ballyhoo, a sort of Depression-era Adbusters.", page: 5547 },
      { text: "Margaret Bourke-White’s “American Way” billboard series,", page: 5597 },
      { text: "Critical Mass bicycle rides. The idea started in San Francisco in 1992 and began spreading to cities across North America, Europe and Australia at roughly the same time as RTS.", page: 5713 },
      { text: "The earth is not dying, it is being killed. And those that are killing it have names and addresses. —Utah Phillips", page: 5854 },
      { text: "In his book about corporate power, Silent Coup, Tony Clark takes this theory one step further when he argues that citizens must go after corporations not because we don’t like their products, but because corporations have become the ruling political bodies of our era, setting the agenda of globalization. We must confront them, in other words, because that is where the power is.", page: 6121 },
      { text: "right—you’ve got to stand up for what you believe in instead of just standing in front of the mirror trying to look good!”", page: 7144 },
      { text: "conscientious consumer?", page: 7520 },
      { text: "The bottom line is that corporate codes of conduct—whether drafted by individual companies or by groups of them, whether independently monitored mechanisms or useless pieces of paper—are not democratically controlled laws.", page: 7813 },
      { text: "For years, we in this movement have fed off our opponents’ symbols—their brands, their office towers, their photo-opportunity summits. We have used them as rallying cries, as focal points, as popular education tools. But these symbols were never the real targets; they were the levers, the handles. The symbols were only ever doorways. It’s time to walk through them. —Naomi Klein, February 2002", page: 8157 }
    ]
  },
  {
    title: "Tokens",
    author: "Rachel O'Dwyer",
    coverImageUrl: "/book_covers/tokens.jpg",
    description: "An essential guide to how digital tokens, NFTs, and crypto are redefining our social and economic landscape, often in ways that favor platforms over people.",
    link: "https://www.penguinrandomhouse.com/books/721301/tokens-by-rachel-odwyer/",
    highlights: [
      { text: "There are different meanings wrapped in a wink, I’m told by Taylor Nelms, who is studying alternative currencies in Ecuador. The wink says something. A wink is deliberate, directed at a particular person, and used to get a message across that won’t formally register with others.1 Winks are part of an established code. Winks are layered with social meaning. The anthropologist’s job, Taylor says, while the others around the table nod knowingly, is to catch these ‘winks’ and uncover their meanings", page: 103 },
      { text: "The Chinese super-apps WeChat and Alibaba, with legacies in gaming and online retail, operate the payments systems that are used by virtually all Chinese citizens. The apps support online and in-store purchases, gameplay and virtual gifting. In turn, the data produced by these activities is used to underwrite credit.", page: 123 },
      { text: "In 7500 BC, Neolithic tokens emerged alongside the development of agriculture. The first tokens responded to a need to store and trade goods collectively. Clay was fixed into simple shapes representing commodities – quantities of grain, oil, livestock, and human labour.2 These tokens were not only the first example of accounting; they were also the first example of written record-keeping. They were made to keep track of things. Later, the clay tokens became exchange media in their own right. They conjured the ownership of real things in the real world.", page: 142 },
      { text: "By transforming or limiting the liquidity of everyday money, tokens could be programmed to curb the economic freedoms of particular social groups: scrip tokens for workers that could only be spent in the employer’s own store; store credit for a wife; vouchers and food stamps for the poor. Tokens can thus also be a way of attaching special conditions to payments. They can bring spending, eating, parenting, and, well, living in line with the issuer’s objectives.", page: 223 },
      { text: "Technology is never neutral. Who shapes it and what it does have political consequences. As Langdon Winner noted, our ‘artefacts have politics’.12 Over time, as a technology moves from the shiny foreground into the background, these effects are fixed, even forgotten.", page: 232 },
      { text: "Amazon even pays its non-US and non-Indian Mechanical Turk workers exclusively in Amazon Gift Cards.", page: 275 },
      { text: "For Twitch, Bits are a way of capturing value from content on the platform, but they are also a regulatory sleight of hand, a way of employing workers without a contract and processing payments without a financial licence.", page: 293 },
      { text: "Researchers exploring streaming platforms in China have identified various motivations for sending gifts and virtual tokens to streamers. They indicate a desire to reward ‘valuable content’, or show support and appreciation for the streamer. But tokens are also a way to stand out from the crowd, to signal status or grab attention. Sometimes the token is a way to bridge and foster a lingering connection between the person cheering and the person on screen. More nefariously, tokens can also be used to communicate approval or disapproval, to say ‘keep going’ or ‘stop’.", page: 377 },
      { text: "Because tokens are not real money, they hide the transaction. They abstract the work away. They allow everyone to pretend that what is happening is ‘just for fun’, that it happens ‘among friends’.", page: 565 },
      { text: "In the pre-capitalist system, a landlord extracted value by virtue of ownership rather than through any direct organisation of workers. Platforms are just the same: they are the slumlords and feudal kings of the internet. Amazon is not investing in paying its streamers wages, providing them with the technical equipment required to produce and edit their streams, or organising their content or working hours, but simply providing a stage for streaming live content and a rail for processing payments, and positioning itself at the centre of that process. By controlling the issuance and redemption of tokens – how they are cashed in and cashed out – Amazon extracts revenue.", page: 787 },
      { text: "The earliest tokens are thought to date back to 7500 BC, when settled farming communities began to track stocks of grain and precious metals. Mesopotamian clay tokens in the shape of cones, spheres, ovoids, and cylinders stood in for a recorded quantity of barley or silver in storage.4 These clay tokens were a ‘stored memory’ of stored assets.5 Later, around 3200 BC, grain harvests were centralised in state warehouses in both Babylon and Egypt. Tokens represented an individual’s share in the store. These tokens were first-order records – receipts and proto-money in one.", page: 889 },
      { text: "In the eighteenth century a strange literary genre emerged (Mary Poovey calls it the ‘literature of social circulation’).9 Thomas Bridges’s Adventures of a Bank Note (1759–75) and Charles Johnstone’s Chrysal; or, the Adventures of a Guinea (1760–65) are both narrated by money. The coin or note tells the story of all the people it meets on its journey and the conversations it overhears as it passes from hand to hand. Chrysal the Guinea describes its journey through the networks of colonial trade, from North America to England, to Holland and Germany. There is a reason it’s a talking banknote and not a talking umbrella. Money was represented as having, as Chrysal put it, ‘a power of entering into the hearts of the immediate possessors and reading all the secrets of their lives’.10 The token bears witness to everything surrounding it. Talking notes, like Sartre’s honey pot, dissolved the boundaries ‘between possessor and possessed’. They reversed the order of things. Instead of humans measuring the worth of the token, it was now the other way around. Money could spy on and weigh up its owner.", page: 920 },
      { text: "In a design informatics project, artist Hang Do Thi Duc illustrated Venmo data in an artwork called Public by Default, revealing just how much could be gleaned from the company’s public API.19 The designer used Venmo’s public transactional data to trace the lives of five users she had never met, including a romantic couple, a food cart owner and his most popular customers, and a weed dealer operating out of Santa Barbara, California.", page: 976 },
      { text: "researchers subsequently reverse-engineered the Venmo feed to pinpoint members of AA, drug deals, users with a chronic gambling problem, illicit romantic affairs, and sex work. Transactions could tell the story of an acrimonious breakup through a flurry of invoices for half a couch, or one of a set of matching candlesticks.20 As on Twitch, money was once more an expressive token – but the expressions, and the desires they communicated, might be worth more than the transaction itself.", page: 981 },
      { text: "What does a simple Venmo message really tell us? Is ‘heat miser’ soon going to need a new roommate? Is marriage or a family on the cards for ‘nice try’? Maybe Bonnie has an eating disorder that will require medical treatment, or even lengthy hospitalisation. All of these stories have financial implications. Many speculate that the money is in the data gathered through these transactions – data on who sent money to whom and for what, on what these surfaced stories can tell advertisers, retailers, and insurance companies about users.", page: 988 },
      { text: "But as things stand at the time of writing, PayPal does not make much revenue from the transaction fees it charges Venmo users.", page: 1000 },
      { text: "Amazon’s 2014 patent for anticipatory shipping – a logistical model using transactional and browsing history to predict future purchases – is one well-hyped example. Instead of waiting to process an order, the company can ship items it predicts a customer will buy later to a warehouse near them. The platform might well have predicted my 4 a.m. order of The Baby Sleep Solution in 2017.", page: 1019 },
      { text: "Palantir Technologies, a company developed by PayPal founder Peter Thiel, is looking to integrate consumer transactional data with sensors in the user’s environment – tags on clothing, beacons in stores, sensors in their home fridge – to fine-tune inventory-flow management.", page: 1024 },
      { text: "A third and rising trend is the use of transactional data to underwrite credit and insurance – the ‘fourth-order records’ discussed earlier in this chapter. Companies now specialise in credit offerings based on mined transactional data. They target users who have limited access to financial services – the ‘underserved’ or ‘unbanked’ – but also users whose credit, in the aftermath of a crash and a global pandemic, might be deemed subpar, a vulnerable category Joe Deville and Lonneke van der Velden have dubbed the ‘digital subprime’ market.22", page: 1027 },
      { text: "technique recently developed by the English statistician (and eugenicist) Ronald A. Fisher became popular. ‘Discriminant Analysis’ allowed researchers to distil the information from credit applications into a set of discrete variables, each with a value and weight reflecting its statistical association with payment or default. Income, it turned out, was not a good predictor of anything, and nor was marital status – but things like room-to-child ratio and having a telephone in the house were. While statistics told the credit analysts that certain variables were important for predicting risk, they were often unable to say why.", page: 1064 },
      { text: "Alibaba’s three-digit ‘Zhima Score’ dictates the terms of a personal loan based on variables such as what degrees its customers hold, data from their social networks, and how many video games they have purchased in the past month – but it also affects visibility on Chinese dating sites, employability, and even access to a Schengen Visa.", page: 1088 },
      { text: "Critics often point to the inherent bias of those who write the code, but also to the fact that the machine learns from a wealth of historical transaction data that is chock-full of old inferences and resentments. It has been shown, for example, that having an African-American name negatively affects the new algorithmic credit scores. Meanwhile, Amazon Prime’s same-day delivery areas follow the contours of these historical maps of credit exclusion. Redlining is still there in the background – a stain that won’t shift. And when an algorithmic score stands in for the messiness of real-world decisions, those outcomes are harder to contest.", page: 1135 },
      { text: "As governments explore the development of central bank digital currencies (CBDCs) – digital tokens tied to the central bank – the possibilities for direct government transactional surveillance loom large. Hyun Shin of the Bank for International Settlements spoke evocatively of the CBDC as money with memory, predicting that ‘computing and technology can come to the rescue, and fulfil the vision of a shared ledger of all past transfers’.34 This would produce a state-backed money where nothing is ever forgotten, ‘the power of memory driving everything into the light by linking it all together and making escaping into the shadows an impossibility’.35", page: 1152 },
      { text: "In the United States, Thiel’s Palantir Technologies currently forms a link between US tech companies and the US state. Its main customers are federal agencies. Palantir Gotham provides these agencies with transactional data for counterterrorism and fraud investigation. The United Nations World Food Programme, Team Rubicon, the National Institutes of Health, and the Polaris Project (an organisation specialising in combatting sex trafficking) have all used Palantir’s transactional datasets.", page: 1169 },
      { text: "It seems, in 2022, as if social credit might act most forcefully as a Western imaginary of state surveillance happening ‘elsewhere’ – one so perfect in its dastardly awfulness that we are distracted from the realities playing out in our phones and wallets – ones that are a little less novelesque, less suited to the capitalist realism of a Netflix series. Social credit is the spectre by comparison with which a surveillance programme seems tame because ‘at least we’re not China’. But we don’t need to look to China to see the machine at work.", page: 1183 },
      { text: "There is a tension here between the control and issuance of a token by the state and the ability of a person on the street to use this public medium for critique – to send a signal back to power, or out into the world. Because the messages are anonymous, they are safe to convey. Cash acts as an analogue point-to-point medium, something that everybody uses but nobody quite controls. Even with social media these practices continue, maybe because there is nothing quite so immediate as defacing a banknote. In Ireland, where a controversial system known as ‘Direct Provision", page: 1194 },
      { text: "For journalist Brett Scott, the pandemic was a keystone in the ongoing ‘cold war against cash’ – a push to wean people from physical, public tender onto traceable tokens. The way Scott sees it, all digital money – whether issued by a crypto start-up, or PayPal, or a commercial bank – is nothing more than private scrip, drawn on the deferred promise of redemption through state-backed money. It is only when we exchange these private tokens for cash – when we, literally, ‘cash them out’ – that we exit the private system.36 Far from a frictionless dream, the cashless economy ties us in.", page: 1209 },
      { text: "innovations Chaum had developed for DigiCash, including blind signatures and chains of authentication. The cryptocurrency offered early adopters some anonymity, because, as with Chaum’s tokens, the transactions used public and private keys. An encrypted currency should be untraceable, Chaum argued; there should be no way to reconstruct the user’s real identity from their digital pseudonym. In many ways, though, the Bitcoin protocol was more revealing than other payments systems, because the entire history of all tokens was publicly available. Anonymous data on the blockchain and identifiable data on message boards, public forums, and social media networks could be pieced together to match real identities to Bitcoin addresses. This is now the aim of anti–money laundering units worldwide, which spend time connecting known identities to anonymised transactional data. As Bitcoin transactions have become more traceable, other coins have attempted to foil surveillance by scrambling these traces.", page: 1266 },
      { text: "My interactions with Bitcoin zealots have made me wary of men who want to single-handedly redesign the economy,", page: 1315 },
      { text: "With money burning, the initiative stems less from a desire to erase the promise inscribed on a banknote than from a desire to erase the contractual obligations of the money relation altogether, revealing what one burner describes as ‘our blind fixation on money as an object through the act of destruction’. Choosing to burn a token, or otherwise permanently remove it from circulation, shrinks the overall supply of that currency. The act of destruction has a deflationary effect that increases the value of the cash still in circulation. And because what is destroyed is merely a document of the thing and not the thing itself, the act does not destroy anything beyond the record of the bearer’s claim on society. As Noam Yuran puts it, ‘burning money, of whatever amount, disrupts the cosmic double-entry bookkeeping system that dominates our relation to the economy’.", page: 1342 },
      { text: "money. I am reminded of a performance by Geraldine Juárez in Berlin in early 2014, where the artist transferred bitcoin onto an XD card and toasted it, marshmallow-style, over a campfire outside the Haus der Kulturen der Welt.", page: 1354 },
      { text: "Burning money is a sacrifice, says Harris. At times it can feel like a hammy ritual, a suburban swingers’ party with a touch of Bacchanalia to add to the spectacle. In making the burning of money a sacrament, I ask Harris, are you not just feeding into the fetish of money? Why give the token so much sway? ‘I see it as a ritual of disenchantment’, Harris explains, ‘a de-fetishisation of money, a rite that paves the way for a new narrative.’ Burning the token makes room for a new story, maybe even a new economy.", page: 1370 },
      { text: "Burning the token puts us in touch with an affective space that is beyond exchange, beyond the economy. ‘Every time we spend money, we invoke a future’, writes Lana Swartz.52 And, strangely, burning money does the same thing. Burning money invokes, for a moment, the possible unfolding and suppressed futures in your hand – the money that could have been donated to charity or spent in a local shop or saved or gifted to a friend or turned into food, but also the possibilities of a different economy, and another kind of future.", page: 1379 },
      { text: "There is a space between the bureaucratic token and the token on the street. This is the space between state policy and what James C. Scott called the ‘weapons of the weak’.3 Something less than outright resistance, it is the foot-dragging and muttering and feigned ignorance that wears away at the operation of power.", page: 1411 },
      { text: "Maureen’s in Stoneybatter, Co. Dublin, closed in 2021. She was a crabby institution of a woman who had no truck with the gentrifying crowds swarming Manor Street for Sunday pancakes. ‘She wouldn’t sell me a can of COKE!’ My husband is apoplectic. It is 2019, and he has just returned from rushing our toddler to the GP with a fever. He was in such a rush that he forgot to bring coins for the parking meter and ran into Maureen’s to buy anything to break a note. She refused to serve him on the grounds that he was ‘only looking to make change for the parking’. Maureen’s was cash only. ‘I asked her what I could get for a tenner’, one customer recalls, ‘and she gave me two fives.’4 Maureen stocked, but hated selling, phone credit. Maureen’s accepted butter vouchers.", page: 1414 },
      { text: "rushing our toddler to the GP with a fever. He was in such a rush that he forgot to bring coins for the parking meter and ran into Maureen’s to buy anything to break a note. She refused to serve him on the grounds", page: 1416 },
      { text: "For economic anthropologist Karl Polanyi, the validity of some object as ‘money’ rested on five criteria: the temporal, the territorial, the economic, the social, and the local. Did the object expire over time, or did it hold its value? Did it have spatial limits? Did it account – and could it be redeemed – for a broad variety of things, or only for specific things? Could it be used by everyone, or only by a select group? Were there restrictions attached to its use?", page: 1431 },
      { text: "any moment in modern history, but it is especially jarring now. By Polanyi’s definition, butter vouchers are clearly special-purpose money. And, also by Polanyi’s definition, all money is to some degree ‘special-purpose’. There is no token that is universally accepted in any time and place for anything. It seems more accurate to say, as Friedrich Hayek does, that we are dealing with a spectrum of exchange media. Instead of a hard line between fungible and non-fungible tokens, we have ‘a range of objects of varying degrees of acceptability which imperceptibly shade at the lower end into objects that are clearly not money’.", page: 1441 },
      { text: "we are now surrounded by things that skew across the five functions, to the point where it feels like a whole range of bespoke tokens might crowd out the fungible: money that straddles the cracks in the economy, money that can only be redeemed through specific channels or for very specific things, money that is tied to our identity or that circulates in niche circles, money that comes with strings attached. Viviana Zelizer", page: 1446 },
      { text: "Zelizer’s focus was on the earmarking of money for the poor throughout the 1800s. Straightforward cash transfers to the poor were seen as a ‘dangerous form of relief’, open to abuse, and the charitable organisations distributing aid were determined to make money ‘as safe as groceries’ for those receiving it.10 They did this by replacing cash with special tokens. Sometimes money was even substituted for in-kind relief (‘food, clothing, or fuel, but not money’) or grocery orders (‘provisions for necessary support only’).11", page: 1453 },
      { text: "‘Earmarking sends a message’, writes Bruce Carruthers.15 These special tokens were ‘instructional currencies’, designed to drive home a lesson about frugality and proper spending as much as they were made to give material relief. There was a morality to the token. Not value, then, but ‘values’.", page: 1467 },
      { text: "In the fourteenth and fifteenth centuries, charitable tokens were branded with the items they could be redeemed for (bread, meat, wine, charcoal). Others marked the right to be excused from a toll. A token specified the quantity and type of goods it could be redeemed for, but also, crucially, who was to be given access to charity.16 The charitable tokens could distinguish between the ‘deserving’ and the ‘undeserving’ poor. If you did not hold a token it was because, by some moral calculation, you did not deserve one.", page: 1470 },
      { text: "Today, SNAP benefits come pre-loaded onto an Electronic Benefits Transfer (EBT) card. SNAP earmarks the tokens at source. SNAP benefits are ‘not the same as monetary assistance’. They are not ‘for general spending’ or ‘to receive cash-back services’. They can be used for fresh food and produce. They cannot be used for hygiene products, vitamins or medicines, or alcohol or tobacco. They can be used for cold deli food, but not for hot meals.17 (Why cold pre-cooked meat but not half a rotisserie chicken? It seems there is something too ‘easy’ – too idle, maybe – about buying a hot meal for your family using benefits.)", page: 1482 },
      { text: "Tokens are now smart or ‘programmable’, which is to say that the conditions governing their use, redemption, and transferability are hard-coded in an object. The ‘script’ is no longer a set of terms and conditions printed on the note that we can turn a blind eye to. Alongside software, many of these programmable tokens also involve the use of what are called ‘smart contracts’ to automate the terms and conditions of an exchange. If the conditions are right – the right amount, the right denomination, the right person, the right credentials – then a transaction is triggered.", page: 1571 },
      { text: "Fintech consultant David Birch believes that programmable money will emerge ‘amid the fusion of reputation, authentication, identification, machine learning and AI. This is money that has a memory, but it’s also money that has an API – that can make decisions about you. Different actors might produce it or coproduce it. Different transactional communities might form around the values hard-coded into different tokens. ‘It might be’, Birch suggests, ‘a type of money that will prevent people from using it unless they have a track record of upholding its values.’", page: 1640 },
      { text: "Writing on a cashless society in 1992, Cypherpunk founder Timothy May reasoned that e-money might soon be ‘non-fungible’. ‘It is fairly easy’, May observed, ‘to attach various restrictions to the electronic databases which hold the money.’ By updating a database, conditions can be attached to electronic tokens, rules about who could use it and what they could use it for. In a speculative post called ‘Scenario for a Ban on Cash’, May argued that these non-fungible tokens might play a role in the exercise of state power in the future – in particular through ‘ “welfare reform” by restricting the allowable expenditures that can be made’.41", page: 1654 },
      { text: "Unlike cash, tokens are often linked with identity. Foundling Tokens, for example, were special keepsakes lodged with orphans in London institutions in the 1700s. The admissions process instructed parents to ‘affix on each child some particular writing, or other distinguishing mark or token, so that the children may be known thereafter if necessary’.43 The object was tucked into the admissions papers. Both were placed in a sealed envelope. If a mother reclaimed her child in the future, the unique token in the envelope acted as the means of identification.", page: 1670 },
      { text: "Similarly, Sam Altman, best known as the CEO of ChatGPT parent OpenAI, is also the co-founder of Worldcoin, a project to combine a global identity system (based, again, on tokenised iris scans), a digital coin, and a means of payment, into one utility. Altman predicts that, in the future, AI will displace so many waged jobs that citizens will instead require a Universal Basic Income to survive. This payment will be issued through the Worldcoin app. To prevent fraud, the token will be tied to identity.", page: 1687 },
      { text: "Some will be bonded by privilege, while others will be cribbed together by shared disadvantage. One user might be an affluent early adopter who wants to patronise ethical supply chains. Another might be an asylum seeker, a welfare recipient, or a gig worker whose payments are skewed to reflect identity, religious custom, education, nutrition, or parenting style. These tokens are not designed to secure greater ease or agency. They swap out the freedom of fungible money for something with strings attached. One kind of money for you, another for me.", page: 1738 },
      { text: "Like reputational credentials and the Hawthorne Exchange, our online reputations, actions, and social graph might become a gateway for transaction. Tokens as credentials, or as a proxy for identity or reputation, are in our future. And who better than Facebook to manage that? ‘I call it KYZ or “Known by Zuck” ’, Birch tells me with a twinkle. ‘And really, why wouldn’t your Facebook identity be more reliable to Uber or whoever? I can buy a fake passport on the dark web, but building a fake profile with a real social graph and real history takes a lot of grunt work.’62", page: 1820 },
      { text: "The question is not only whether money will be programmable or tied to specific conditions in the future, but also who will produce and manage these scripts going forward – the state, the platform, or, as in some Web3 imaginaries, a decentralised community. What kind of a story is this? Do we like where it’s going? If not, change the script.", page: 1877 },
      { text: "Think about the difference between asking a neighbour to keep an eye on your two-year-old with the vague expectation that you will (probably) do (much) the same for him (at some time in the future), versus the experience of hiring and paying for a babysitter at the going rate, plus a taxi fare. Give-and-take between friends has roots and offshoots. There is no direct equivalent for a gift, no sense that things have been squared tidily away. Real money undercuts these ties.", page: 1913 },
      { text: "Stefan and Ralph Heidenreich make the case for a moneyless economy in which tokens are abolished", page: 1935 },
      { text: "Another approach is to design money differently, in a way that feels more equitable or fosters different social relationships, or that values things – care, the environment – that are doorstepped by the economy. With the rise of cryptocurrencies and artificial intelligence, as Jaromil suggested, there’s a sense that we now have the tools to rethink how money works. Money, still, but let’s make it social.", page: 1937 },
      { text: "While libertarians such as Ronald Coase and Garrett Hardin argued that these commons were destined for ruin because people are naturally too selfish to cooperate, economist Elinor Ostrom published a study in 1990 that observed numerous examples of successful commons in action.8 This enabled her to develop an algorithm that gave individuals an ‘incentive’ to contribute to a shared good – a set of rules for ‘governing the commons’.9 Like Hardin and Coase, Ostrom began from the assumption that individuals are inherently self-interested, and set out guidelines to establish a balance between individual and collective interest.", page: 1956 },
      { text: "By the time mainstream banks were experimenting with blockchain as a clearance and settlement tool, nobody was linking Bitcoin with the lefty internet, just as nobody in their right mind was linking YouTube with Utopia.", page: 1989 },
      { text: "Today local exchange trading systems (LETS) and time banks are both examples of mutual credit systems in action.", page: 2047 },
      { text: "The ‘we’ in Bitcoin was mining power, then, but it was also social capital, almost exclusively white, male, tech-savvy – men like Bjorn, men like the start-up bros tipping strippers in Vegas with wads of dollar bills. Transgression, economic disruption, maybe, but still business as usual.", page: 2141 },
      { text: "Other cryptocurrencies have tried to institute demurrage. Circles UBI (for Universal Basic Income) in Germany, for example, is a token designed to be worth less to its users in a year than it is today. Users are urged to invest their wealth in the Circles community rather than in a speculative token. Freicoin, too – an offshoot of Bitcoin – is a token that falls in value by 4.9 per cent each year, encouraging consumers to spend or invest it, thereby driving up GDP.", page: 2208 },
      { text: "Is it okay, for example, to purchase a viatical – a share in a life insurance policy that yields a profit when the claimant dies? The sooner this happens, the better for the investor.43 Surely there’s something a little too morbid about this calculation on life and death? (In the late nineties, as the AIDS pandemic shifted from a fatal disease to a chronic illness, survivors were plagued by calls from brokers who had bought their life insurance for a killing, asking, as politely as possible, why they weren’t dead yet.)", page: 2247 },
      { text: "Fureai Kippu was a Japanese care token. ‘Fureai’ loosely translates as ‘the formation of emotional connections across generations’, or elsewhere as ‘ticket for a caring relationship’. Without a word of Japanese, I come to think of the token as ‘furry’ money, a softening of the hard lines of a typical transaction. Fureai Kippu was designed as a local currency in 1995. It allowed citizens to earn tokens by helping the elderly in their community. The unit of account was an hour of community service. As in a time bank, these tokens were earned through acts of care, and could be redeemed for care. Users could earn the tokens and transfer them to elderly parents or relatives living in distant parts of the country. The system accommodated a Japanese cultural objection to charity by allowing for the semblance of a transaction. But the tokens were also special, in that they carried an emblem of real feeling, even a kind of referred love. Seniors preferred to receive care services paid for in Fureai Kippu than those paid for in Yen.45", page: 2256 },
      { text: "Social tokens like Fureai Kippu and energy-backed currency units represent attempts to engineer the market to value things like care, or the air we breathe. Putting a price on a social cost is supposed to make it more valuable. But, like Almeling’s donors, it runs the risk of turning something beyond price into just another economic good. Users are less likely to donate blood if they are paid, and more likely to be late collecting their children from childcare if they are charged a fee, Sandel has discovered.", page: 2302 },
      { text: "the artist Núria Güell, whose work deals with financial activism, ponders these questions in a recent work on motherhood. Afrodita (2018) is an attempt to justify the time she already spends with her child as an artwork, so as to get funding to make more. But Núria also disrupts the catch-22 involved with putting a price on her care. Doesn’t this economic calculation risk making love into something measurable and productive – just another economic good?51", page: 2305 },
      { text: "I think of wampum, the shells traded in what is now New York until the early eighteenth century. Before European settlers set eyes on the whelk and clam shells, wampum beads were part of a dense gift economy, used for storytelling, bonding, and remembering, for ranking and marking down important events. Through a colonial lens, the wampum looked very much like a regular means of exchange, one that could be dredged from the shore and worked with European tools. Wampum were mass-produced and used by settlers to ‘buy’ Indigenous land, when the land had never been for sale, just as the token had never really been money.", page: 2403 },
      { text: "Keith Gill (a.k.a. Roaring Kitty) on Reddit and other channels (YouTube, TikTok, Twitch), users began a coordinated action to buy and hold GameStop call options (and in some cases GameStop stock) to drive share prices in the other direction, creating what’s known as a ‘short squeeze’. The hedge funds that initiated the squeeze were forced to buy back the stock to avoid losing any more money. GameStop stock went from less than \\$3 in 2020 to \\$483 on the morning of 28 January 2021. At this critical point, the Robinhood app intervened to prevent its users from buying any further call options, citing ‘market volatility’.", page: 2426 },
      { text: "Users swap homophobic and racist slurs, misogynistic backhanders and quips about suicide. There is no solidarity here. There are ‘frens’ but no friends.6 On the ‘loss porn’ thread, someone posts that they have invested their entire student loan in one meme stock and now have nothing. They have not slept in days. In response, someone else shares a GIF of a slice of bread being fed through a cheese grater. Someone else links to a rope for sale on Amazon and suggests that the poster buy it to hang themselves. Do it, the forum agrees. It’s what evolution would want. KYS. For the good of the species. All this nihilism makes a kind of meaningless sense when the future has no perceivable value. The forum doesn’t trade on individual expertise, but on a kind of collective mindlessness that might contain within it a swarm intelligence. The retail investors of WallStreetBets were not selling themselves as experts or canny investors, or even as nice people.7 Instead, like Gessel’s natural men, they were just ‘a bunch of guys’, they were fellow degenerates. They were, as one meme put it, ‘apes, together strong’.8", page: 2455 },
      { text: "GameStop did not represent a radical disintermediation of power – except maybe in pointing to the power of social media not only to meme elections, but to meme the market.10 If anything emerged, it was once more the power of a platform to shape the future of money. If memes were driving money, then social platforms were at the wheel.", page: 2484 },
      { text: "One response to monetary reform treats money like a design problem to be solved. Coin the perfect token, and the perfect society might follow. The time banks, demurrage, and Fureai Kippu explored in the previous chapter all fall into this category.", page: 2489 },
      { text: "Rather than build anything new, it parasites on the system it claims to hate. The meme, remember, was not ‘steal from the rich’ but ‘eat the rich’. There’s a difference. The slogan asks that you take the system into yourself. We don’t need to quit everything and set up a barter economy in West Cork. Don’t transcend – be an ape. Don’t beat the system – eat the system.", page: 2491 },
      { text: "Duran went all-in and applied for progressively larger amounts, exploiting the latency between when a loan was drawn down and when it was registered. He learned the structural weaknesses of the financial system and gamed them accordingly. Today it wouldn’t work, he says. More is recorded. There are fewer loopholes. Duran wanted to demonstrate a form of civil disobedience against the banks by refusing to repay his debts, but he also wanted to show others that there was an alternative – that finance could support cooperative living. He turned all the money over to social movements, though not all of them were willing to accept it out of fear of litigation.", page: 2511 },
      { text: "I read accounts of Duran’s exploit at the same time as I explore artist Cassie Thornton’s work on debt. Much of her practice centres on the embodiment of debt, the way it makes the indebted subject feel in their body – anxious or tied down, cut off, lonely, ashamed, or unsafe. She hosts group meditations where people come together in solidarity and try to release these feelings – the burdens of their mortgage or their student loans – from their bodies", page: 2525 },
      { text: "The team preferred ‘The Parasite’, in a nod to philosopher Michel Serres’s famous book on resistance from within the system.", page: 2550 },
      { text: "‘The great art project of our age is to entirely collapse the distinctions between “fraud” and “performance art” ’, writes the financial journalist Matt Levine, ‘so that one day mortgage-bond traders will be able to say, “Wait, no, I wasn’t lying about bond prices to increase my bonus, I was performing a metafictional narrative about bond-price negotiations in order to problematize the underlying foundations of bond trading in late capitalism.” ’", page: 2586 },
      { text: "At first, the blockchain was limited to transactions. But in 2014, a start-up called Ethereum expanded the Bitcoin script so that it could execute any kind of function. Its founder, Vitalik Buterin, was not quite twenty. Ethereum created what were known as ‘smart contracts’ to automate a wide range of decision-making processes. They also built a new governance structure called the decentralised autonomous organisation, or the mystic-sounding ‘DAO’ for short, a market-based organisational structure for cooperation without the need of a government.", page: 2682 },
      { text: "The Extropian list (and a magazine called Extropy) was founded by philosophy and economics graduate Max T. O’Connor (until he changed his name, appropriately enough, to Max More, to signal his desire for perpetual growth). More’s doctoral dissertation used metaphysical philosophy to explore the nature of individualism. Should we replace the self with a better self if such a thing is technically possible? More is now CEO of Alcor Life Extension Foundation, a non-profit in Arizona that specialises in cryogenic freezing. For a hefty fee, Alcor will preserve your dead body in liquid nitrogen, in the hope it may be revived in the future. Looking down the list of bodies stored or promised to Alcor in the future, I recognise many of them. There is Robin Hanson, who coined Idea Futures, a system where markets are used to make policy decisions that inspired Ethereum. There is Ralph Merkle, one of the inventors of public key cryptography. PayPal’s Peter Thiel is, unsurprisingly, on the list, as is the AI computer scientist Eliezer Yudkowsky and the inventor of the singularity theory, Ray Kurzweil.", page: 2752 },
      { text: "Lana and I have been asked to speak at a conference at the New School about blockchain. We are part of fledgling discussions about how the technology might be used for governance beyond the state: a killer app for human cooperation – blockchain for voting, blockchain for an anti-capitalist share economy, blockchain for citizen science. ‘What do they imagine government even is?’ Lana asks again. Her fiancé, Kevin, comes over to join us. We speak about J. K. Gibson-Graham’s diagram of the capitalist iceberg.15 Waged work is visible above the surface, while the bulk of care and unpaid work is hidden underneath. The same might be said for how the crypto community imagines government, Lana argues. There’s the slice of the state that’s visible to Bitcoin, the bit that blockchain enthusiasts want to switch out for smart contracts, but, underneath, a tonne of invisible work keeps the bulk afloat. For the founders of Bitcoin, this thing called government looked a lot like force. It was the ‘use of force’ as opposed to persuasion.16 It was the ‘unilateral exercise of coercion’.17 Government was ‘the “right” of the leaders of existing institutions to impose their will on other people’.18 But government was also seen as something boring and sluggish. It was ‘paying taxes, filling out forms for every stupid thing, waiting periods’, and ‘all the other crap’, wrote one contributor to the Extropian list.19 Government was stasis and stagnation. The iceberg was barely moving; it was, quite literally, a drag. ‘\\[W\\]hat two better words are there to describe government bureaucracy than “dull” and “sluggish”?’ Chuck Hammill wrote in the first ever post to the Cypherpunk list, a 1987 essay called ‘From Crossbows to Cryptography: Thwarting the State via Technology’.20", page: 2773 },
      { text: "The Cypherpunks were influenced by books such as The Machinery of Freedom, by David Friedman (son of Milton), an anarcho-capitalist text arguing that law should be switched out for technological solutions, and William Rees-Mogg and James Dale Davison’s The Sovereign Individual, which forecast a shift from the nation-state to entrepreneurial governance, in which shareholder votes and contracts (not unlike Weyl’s quadratic voting, in fact) would replace the democratic process.22 The group wanted to replace politics with a neat, automated solution. Anarchy, in the words of the Cypherpunk glossary, was ‘a technological solution to the problem of too much government’.23 Anarchy, May wrote, had a bad reputation because it was most often associated with chaos and an absence of control, but here it signified an ‘ “absence of government” (literally, “an arch,” without a chief or a head)’.24 It was rules without rulers. Chop off the head, but replace it with the right protocol.", page: 2801 },
      { text: "The Machinery of Freedom, by David Friedman (son of Milton), an anarcho-capitalist", page: 2802 },
      { text: "In 1994, Nick Szabo posted his seminal work on smart contracts – self-executing agreements that used cryptography rather than legal mechanisms to ensure compliance. Such contracts would work not because of the threat of external coercion by the state (as in the legal system), and not because the parties involved knew or trusted one another (as in the kin-communal systems of the Irish bank strikes), but simply because the contracting parties trusted in the technology to execute the contract.28 ‘You trust the thing because of the way it behaves, not because you trust the people who gave you access to it’, wrote Robert (Bob) Hettinga to the forum.29 It was not that these systems could complement a broader political process, but that they might replace it altogether – that technology could, in itself, remake the social. As Eric Hughes put it in his statement of purpose for the Cypherpunk list, ‘cryptographic protocols make social structures’.", page: 2823 },
      { text: "The founders of Bitcoin did not like people very much. For the philosopher Hannah Arendt, however, there was no freedom without other people. In The Human Condition, Arendt explores the desire to switch out politics for design-based solutions. One consequence of freedom, Arendt writes, is the basic unreliability of other (free) humans. Freedom carries its own risks. For Arendt, the desire for a life ‘by the code’ responds to this uncertainty – what she calls ‘the incalculability of the future’.31 Technologies that try to predetermine human behaviour – like contracts, or codes of conduct between otherwise free agents – are a way to grapple with the weight of the unknown, to make living with others a little more certain. A promise gives those in power the ability ‘to dispose of the future as though it were the present’, Arendt writes.32", page: 2833 },
      { text: "not everybody on the Cypherpunk list agreed that the messiness of government systems could be switched out for a neat technical solution. Nick Szabo, surprisingly, argued that ‘crypto-anarchy in the real world \\[would\\] be messy, “nature red in tooth and claw”, not all nice and clean like it says in the math books’.37 Code or no code, Robert Woodhead wrote, anarchy would be ‘very uncomfortable, unless you \\[had\\] more guns and money than anyone else’.38 Others on the list argued that the coming ‘cryptorapture’ would probably just create more need for lawyers to sort out and arbitrate all the ensuing messiness, and more humans to interpret code when the technology failed – ‘if the governments collapse … lawyers will have even more work’, said one.39 ‘Most computer people don’t seem to understand that the law is interpreted not by a computer but by humans’, wrote another.40 The group disintegrated in the late 1990s. Tired of endless arguments clogging his servers, Gilmore tried to introduce moderation to the list, weeding out the bad seeds and the discussion topics he deemed unsuitable. After a lot of heated exchanges and homophobic slurs, the list stagnated. Perry Metzger’s cryptography list took its place. Gilmore continued his work with the Electronic Freedom Foundation until he was forced to resign after a dispute in 2021. May became ever more reclusive, retreating from the world while he took to other mailing lists, working on a novel he described, shyly, as a ‘better Atlas Shrugged’, and sharing increasingly right-wing sentiments.", page: 2869 },
      { text: "Mark O’Connell has argued that the transhumanist desire for escape is a desire for conquest. Mars is the newest Brave New World.52 This is true: Earth was framed as a launch pad for a multiplanetary species. ‘Earth is the womb of the human race,’ Max More wrote in the inaugural issue of Extropy. ‘Not only is there space, there are massive quantities of resources waiting to be exploited for the purposes of the spacers and those left on terra … the vast expanses of space offer us the opportunity to make a fresh start – or as many fresh starts as we want.’53 And yet, it seems to me that Extropia was more about withdrawing than forcing the frontier – a dream of leaving the world behind. It was, as one Extropian put it, ‘more suited to “retreat” than to colonization’.54 Extropia was a retreat from the burdens of the flesh, but also from the burden of care – of trust in and responsibility for others. A retreat from the world and all its problems. A retreat from politics and anything like slow, incremental change. These blueprints set out a desire to be completely self-sovereign, to have no kin. This was what their version of freedom looked like.", page: 2928 },
      { text: "The founder of PayPal, Peter Thiel, is also a fan of seasteading. As well as buying land and applying for citizenship in New Zealand as a bolthole for the apocalypse, Thiel explored the possibility of communes, both on the high seas and in outer space. These were described in his 2009 essay, ‘The Education of a Libertarian’. Much like the Extropians, Thiel argued that the only path to the future was to move beyond the frontier of democratic processes. To escape from the world was also to escape from politics. ‘In our time,’ Thiel writes, ‘the great task for libertarians is to find an escape from politics in all its forms – from the totalitarian and fundamentalist catastrophes to the unthinking demos that guides so-called “social democracy”.’55 In the essay, Thiel writes that he does not despair for the future. This is not, as we might be forgiven for thinking, because he owns a giant bunker in New Zealand and enthusiastically pursues life-extending technology. Instead, he has hopes for the future because he no longer places any hope in others, choosing to focus instead on ‘new technologies that may create a new space for freedom’. ‘The critical question then becomes one of means’, Thiel writes, ‘of how to escape not via politics but beyond it. Because there are no truly free places left in our world, I suspect that the mode for escape must involve some sort of new and hitherto untried process that leads us to some undiscovered country.’56", page: 2940 },
      { text: "Storey County, Nevada, is best known for the Western TV show Bonanza, which ran from 1959 to 1973, following the fortunes of the Cartwright family. A ‘bonanza’ was the name that miners gave to the discovery of silver ore in the vast mines uncovered beneath Virginia City in 1859. After its silver, Storey County is probably best known for its legal gambling and prostitution. Lance Gilman, the owner of a number of brothels in the area, bought the land surrounding his businesses in 1998 for \\$20 million from Gulf Oil. The company had intended to create a luxury shooting reserve on the property, complete with imported big game, until the price of oil plummeted and the project was deemed an unnecessary luxury. Gilman had the real estate pre-approved for industrial purposes instead, and transformed it into the Tahoe Reno Industrial Center, selling the land to tech companies who were drawn to the state for its tax breaks and lenient regulation. Acres of land in the Wild West now house some of the world’s best-known technology platforms. Google and eBay both have campuses there. Tesla has an enormous battery factory. Switch operates a 1.3 million-square-foot data centre. In 2018, Jeffrey Berns, the CEO of a company called Blockchains LLC, purchased sixty-seven square kilometres of land, and established its headquarters there. The company now owns about half of Storey County – acres and acres of land, arid as the surface of a desert planet. Berns made his fortune buying ether in the 2015 crowd sale. But his background is not in financial investment, but in law – in particular, class-action lawsuits against financial companies. A look at the company’s composition shows that most of the senior staff have backgrounds in law and litigation, as opposed to technology or finance. Berns planned to transform the Nevada estate into a smart city called Painted Rock. ‘The city would feature the amenities and services of a typical c... ...ity – homes, schools, businesses and industry’, the proposal states, ‘yet it would be built with block-chain technology at its core.’58 The city would use blockchain to provision energy and control autonomous vehicles, but also to make and enforce its laws.", page: 2959 },
      { text: "Futarchy drew on William Rees-Mogg and James Dale Davidson’s The Sovereign Individual – from which, as we saw, the Cypherpunks also drew inspiration. This text forecast a shift from political to corporate governance, in which economic expressions like signing contracts, buying in, or cashing out would replace political expression. Rees-Mogg and Davidson – the editor of The Times and a private investor, respectively – argued that customers in a market with shares and tokens had more political clout than citizens with a democratic vote. The book is written in the proselytising style of a utopian manifesto – a utopia where the fullest exercise of markets would be an exercise in freedom.71", page: 3049 },
      { text: "The DAO is a leaderless governance structure. Decisions are made and instituted by voting on and implementing smart contracts. Economic shareholders are voters. Tokens are used to cast your vote. As Buterin explains, the DAO uses market forces and automated contracts as the foundation for the democratic process. Tokens collapse the vote and the stake into one, just as they collapse government and commercial enterprise. Politics becomes economics.", page: 3073 },
      { text: "is tempting to draw comparisons between the Greek agora and the use of blockchain today (several DAOs make use of the word ‘agora’, or references to agoric systems, in their publicity materials). But anthropologist Bill Maurer argues that this is a reductive understanding of what the agora was. The Cypherpunks waxed lyrical about the openness of the agora and the perfection of agoric systems – a tokenised politics, but they didn’t really understand how the system worked. The agora was not a marketplace for votes, and the Athenian political subject was not a self-interested individual persuaded to cooperate by way of a token. The interests of the randomly chosen citizen lay not with his own self, but with the interests of the demos, with the collective. As Maurer explains, ‘that citizen did not vote with his voice, so to speak. He tried to anticipate the voices of other free men in the deme, standing part for whole. His singularity was not that of his own incommensurable distinctiveness but that of the deme itself.’80 Instead of exchanging the political voice for an economic process, as the DAO suggested, this was a democracy that blurred the boundaries between the individual and the collective. The Athenian interest was not self-interest or market interest, in other words. These tokens had another politics written in their clay – not the self-sovereign Homo economicus, but a part, standing in for the whole. The Demarchy was not a Futarchy.", page: 3109 },
      { text: "Instead of democracy as collective discussion or time-consuming debate, the DAO preached a bland ‘consensus’. It was a vision of democracy based on self-interested actors, the self-sovereign individuals of the Extropian list, the rational players in Hanson’s Futarchy, the faceless nodes and peers of the Bitcoin community. Chantal Mouffe argues, in contrast, that politics is not some kind of bland agreement – ‘all in favour say aye’ – but precisely the opposite: lots of dissenting voices, debate, disagreement. Mouffe calls this ‘agonistic pluralism’. It is through the rabble – all that ‘gabbing about liberty’ – that social orders are made and unmade. A politics based on consensus, Mouffe says, ensures that everything will stay the same.86 Real change does not happen alone on a tropical island with a blockchain in one hand and a gun in the other. It happens here, in the messiness of other people.", page: 3172 },
      { text: "In 2022, in a move known as ‘the Merge’, Ethereum moved from the proof-of-work blockchain to a system known as ‘proof of stake’. Proof-of-work makes use of a computationally expensive calculation to prevent users from cheating the system; it represents trust as a function of processing power. Proof of stake, on the other hand, allows the users with a greater economic stake in the community to play a greater role in oversight. Or, as researcher Paul Ennis quipped on Twitter: ‘What we really need is a consensus mechnanism where you need millions of dollars to buy equipment and keep a giant industrial warehouse with staff running. Only then will we have truly democratised!’88 Instead of the token representing an investment in energy, it takes a financial stake in the system. Validators are required to stake capital in the form of ether. The staked token ‘acts as collateral that can be destroyed if the validator behaves dishonestly or lazily’.89 The logic, once more, is game-theoretical: it assumes that those with a stake in the system have less of an incentive to act in a way that will destroy its value. ‘The money votes’ – that’s where the politics comes in.", page: 3193 },
      { text: "the Bretton Woods system set out rules of exchange between North America, Canada, developed Europe, Australia, and Japan. Foreign currencies were to be convertible to the US dollar, and the dollar in turn was convertible to bullion held in the Federal Reserve. In 1971, the United States ceased issuing the dollar according to a fixed reserve.5 This was a move to promote global trade by making markets more flexible. From that moment on, state money ceased to be standard, and became fiat money – no longer backed by gold or silver, but by the declaration that it was legal tender. ‘Fiat’, as in fiat lux, or ‘Let there be light’ – it is because I say so. The stone was sunk. In economic terms, 1971 was a watershed – the moment when exchange value parted company with commodities and entered into the realm of financial speculation.", page: 3292 },
      { text: "In March 2022, Santander, the Spanish banking multinational, partnered with Agrotoken, an Argentinian platform, to offer loans in Argentina backed by tokenised crops of soy, corn, and wheat. One thousand farmers received loans collateralised with tokens that were based on soybeans (SOYA), corn (CORA), and wheat (WHEA), listed by Agrotoken. One token corresponds to a ton of grain stored in a grain elevator. The company plans to expand to Brazil and the United States – thereby encompassing the three countries that together account for over 70 per cent of the world’s production of these crops. In the summer of 2022, they also partnered with Visa to use the crops as a payment method; farmers were issued debit cards backed by their grain stores. The tokens were ‘Agrocommodi-ties’, like 2022 was ancient Mesopotamia.", page: 3338 },
      { text: "It is easy to collapse the tokenisation of physical things into the NFT frenzy, but there are ostensibly differences between tokenised physical assets and non-fungible tokens. First, each of the tokens representing a fraction of the Warhol piece was fungible or interchangeable with the others, in the same way any €5 note is supposed to be interchangeable with any other. NFTs, on the other hand, are non-fungible; each one is unique. Second, the ownership rights associated with these physical goods are generally more secure. NFTs are tokens that are often loosely ‘associated’ or ‘affiliated’ with a digital good. More often, owning an NFT of a film does not give the owner any rights to the footage. But with a tokenised security, the buyer does legally own a ton of grain or an ounce of gold or a fraction of a Picasso – even if they never come into contact with it. The token is a share in a real thing, even if there is no way to possess or use the thing in question, and even if the thing is locked up in a grain house or a free port at some distant location, or buried at the bottom of the ocean. Legally, there is a difference; practically, I am still unsure if there’s much of a difference at all.", page: 3369 },
      { text: "This ambition to make things more liquid is at the heart of crypto. Timothy May, founder of the Cypherpunk mailing list, observed in 1992 that ‘crypto anarchy will create a liquid market for any and all material which can be put into words and pictures’.11 Tokens could make a liquid market for any ‘thing’ or non-thing that could be represented by a piece of code: tokens to move past the constraints of bodies, physics, or geography, to unlock equity and onboard real value into the metaverse. As a Money20/20 panellist put it twenty-five years later: ‘We might trade equity in just about any thing for anything else!’ I don’t remember his name, or even the panel, but he was telling a story about the future internet of things; but instead of those things talking to each other, they were busy transacting – a smart car bidding for parking space, an umbrella trading shares in itself when it rained.", page: 3388 },
      { text: "Deloitte’s report, ‘Why Should Art Be Treated as an Asset Class?’, argues that while art has always been an investment, opportunities are growing due to low interest rates in other investments and the sense that technologies like the blockchain might solve extant issues with authenticity, risk, high transaction costs, market transparency, and market regulation. Deloitte’s ‘Art and Finance’ reports (published approximately every two years) also mention an increase in what are called ‘High Net Worth Individuals’ (or simply HNWIs – ‘han-wees’) looking to invest their capital in ‘passion assets’ such as cars, fine wine, and fine art.14 Despite the name, the value of these goods is usually divorced from pleasure. In a keynote at the Talking Galleries Symposium in Barcelona in 2015, Marc Spiegler, the global director of Art Basel, described the death of what he called the ‘connoisseur collector’ – a buyer intimately acquainted with the art world. Spiegler described the emergence instead of a new breed of plutocrat collectors who buy ‘with their ears, not with their eyes’.15 Banks and boutique lenders are developing new financial instruments specifically for this market. Art investment funds, in which buyers club together to invest in a portfolio of works, are one example. Another is art securitisation, where collectors use works in their portfolio as equity to raise capital and secure future loans.", page: 3424 },
      { text: "When an artwork enters the free port, it allows a buyer to hold it there indefinitely without paying tax, while they await the right conditions for resale. In the meantime, the free port also provides a secure base to list the work as collateral for a loan. A buyer can potentially use the work, or even sell shares to finance the purchase of other works, for example, often without having to surrender the work itself to the bank, depending on the jurisdiction. The art is fiscally ‘in transit’ from one place to another, even if it is going nowhere anytime soon. In turn, the free port acts as a kind of ‘bank’ for art, and the works in question are assets, resting indefinitely in high-security vaults, even changing hands without changing location.", page: 3467 },
      { text: "Free ports are a legacy of colonialism, goods and bodies flowing from south to north and from east to west. Free ports in Switzerland, in combination with the country’s involvement in slavery and colonialism, contributed to making it one of the world’s richest countries. While the Swiss had no colonies themselves, they were heavily involved in speculation, investing in the operations of colonialism elsewhere – particularly in the shipping companies that moved nearly 200,000 Africans to America.", page: 3481 },
      { text: "Free ports are a source of fascination for the artist Hito Steyerl, who sees them as emblematic of an institutional shift from the public museum – and from the artwork as a public good – to a globalised art market where art is just another asset class. In the age of the free port, art functions as a financial instrument without duties or obligations to the people or the nation-state. In turn, the state acts as a para-corporation whose main job is to shore up the market. The free port is a kind of blind spot in the supply chain, a place where regulators and states can, as Steyerl puts it, ‘selectively \\[lose\\] control’.19", page: 3490 },
      { text: "Because of the secretive nature of free ports, it can be difficult to account for exactly how many works of art are permanently housed in them. A New York Times article claims that the number in Le Freeport, Geneva, is close to 1.2 million, including some 1,000 Picassos.", page: 3495 },
      { text: "Fractional ownership is sometimes framed as democratising access to a good, or more accurately as democratising access to speculative financial instruments: now the 99 per cent can own fractional shares of Manhattan real estate, or Picassos housed in a free port in Geneva. But this is misleading. It increases access to speculative financial instruments that are usually the purview of the mega-rich, but in doing so it often decreases public access to the artworks themselves. In Duty Free Art, Steyerl questions the morality of such an action. The ‘duty’ in the title references the offshore nature of the art market, of course, but also the question of whether culture has a duty to be seen and shared and viewed by the public, and whether the state still has a duty to make this happen.", page: 3510 },
      { text: "The flipside of this schism between owning and possessing occurs in Yves Klein’s Zones of Immaterial Pictorial Sensibility (1962). Klein is an artist known for his performance works (and for patenting his own colour – a vivid shade known as International Klein Blue). In his 1962 work, Klein sold seven invisible zones of the river Seine in Paris for a pre-specified weight in gold. To purchase the work, the buyer had to meet Klein, and, in the presence of an expert witness of some sort (a museum director, curator, or gallery expert) and two other witnesses, transferred the gold to the artist. Klein would then throw half of the gold into the Seine, where it would be irretrievable – not unlike the rai stone that sank without a trace on the way to the island of stone money. The buyer would now be presented with a certificate of ownership for the immaterial zone. The catch was in the following clause: in order to truly possess the work in question, Klein specified, the buyer now had to burn the deed. Only then would he truly be its owner. From this point on, the work was no longer transferable. To accept the token was to relinquish ownership. To own it was to relinquish all possibility of future exchange. What remains of value when exchange is lost? What remains of art when exchange is all there is?", page: 3555 },
      { text: "by the Salvage Art Institute. The objects here are on display, but not in any way you’re likely to confuse with a gallery exhibition; paintings rest on pallets, sometimes with the remnants of the packaging they were delivered in; sculptures and drawings lie flat on dollies. An oil painting rests at an angle on a trolley. It is a realist pastoral scene – a harvest – only there’s not much harvesting going on. The hay is stacked in the cart, ready for storage. The workers stand around in the sun, chatting, resting in the cut grass.", page: 3565 },
      { text: "Banksy is a guerrilla graffiti artist whose career rests on his anti-commercial appeal. In the style of artists like Martha Rosler and Barbara Kruger, who remix the language of advertisement to assail capitalism, Banksy adopts the visual language of street advertising to attack consumer culture.", page: 3623 },
      { text: "In 2018, a Banksy painting entitled Girl with Balloon was sold for £1 million at Sotheby’s. Moments after the gavel dropped, a shredder hidden in the ornate frame whirred to life and partially destroyed the work. Selling a work at auction for millions was surely a step too far. And so Banksy shredded the painting in an outward protest against capitalism. In the immediate aftermath, Max Haiven wrote about the event as a rousing blow against the assetisation of the artwork.26 I couldn’t disagree more. By only partially shredding the work (‘a mistake’, Banksy claimed), the artist worked to deny his complicity with the market, while, in denying it, also boosting his own cultural capital. Seeming to decry the market can be a necessary step to being taken seriously as an artist. The intact work sold for £1 million, but the partially shredded remains, retitled Love Is in the Bin, were sold by Sotheby’s for more than £18.5 million.", page: 3627 },
      { text: "unlike artists like Banksy and Hirst, who appear at one level to deny the market while also reaping its rewards, Mahama funnels his profits back into the community.", page: 3637 },
      { text: "In 2017, Ethereum developed what was called the ERC-721 standard for non-fungible tokens, allowing a token to represent the ownership of a good. Unlike standard coins that are, at least in theory, ‘fungible’, meaning that they can be exchanged for each other, NFTs are associated with a unique asset. ‘Think of them like rare, one-of-a-kind collectables’, the Ethereum page advises. The protocol takes an everyday token and turns it into a smart contract for the exchange of a one-of-a-kind token – something a little bit like a collector’s item or a centenary coin.", page: 3716 },
      { text: "while pennies are worth pennies and normal Ethereum tokens are worth their current exchange value, non-fungible tokens are worth whatever someone is willing to pay for them. These non-fungible tokens could be used to record and automate the ownership and transfer of digital items, and to treat these digital items – things that can be copied many times at the click of a mouse – as though they had a scarce or rival dimension. But unlike tokenised assets, which mark an ownership stake in a real asset like land, diamonds, or an Andy Warhol piece, an NFT’s claim or stake is less certain. In most cases, NFTs are ‘associated’ with a digital asset. Having an NFT of a cryptokitty or a famous Top Shot does not usually give the owner any exclusive rights to the image or the footage,", page: 3724 },
      { text: "In 2005, Sony embedded rootkit software on all of its music CDs. The software gained administrative privileges on a user’s machine without their knowledge. From there, it prevented copying software from accessing the CD. It also prevented any installation of copying software on the user’s computer.7 Other companies gradually shifted to a model where digital files were streamed or leased from a cloud-based server. In an early controversy surrounding Amazon’s Kindle, a book found to be in breach of copyright after it was sold was automatically removed from thousands of consumer devices without their knowledge or consent. The book was George Orwell’s Nineteen Eighty-Four.", page: 3774 },
      { text: "Mt Gox, the first Bitcoin exchange, started life as an online trading portal where virtual ‘Magic: The Gathering’ cards were traded like stocks. Online games scripted virtual loot on a central server and, to the best of their ability, controlled how and when items were released into the game. Others used embedded watermarks to try to deter users from right-click saving their images.", page: 3782 },
      { text: "In 2015 artist Lorna Mills invited other well-known internet artists to make works for a video piece called Ways of Something. The work, a mash-up of GIFs, drawings, and archival footage, is a remix of the John Berger documentary Ways of Seeing, itself a response to Walter Benjamin’s 1935 essay, ‘The Work of Art in the Age of Mechanical Reproduction’. In this essay, which every undergraduate art student reads at some point, Benjamin argues that photography potentially destroys what he refers to as the ‘aura’ of the original work of art: ‘its presence in time and space, its unique existence in the place where it happens to be’ – what crypto-enthusiasts might today call its ‘nonfungibility’.11", page: 3798 },
      { text: "The original is not a universal concept. Benjamin’s ‘aura’ is a product of Western philosophy and aesthetics. Western culture’s rejection of mimesis can be traced back to Plato’s concept of being. It equates beauty with the unique, allowing for no reproduction or facsimile. In every copy, the Korean-born philosopher Byung-Chul Han writes, ‘this \\[Western\\] notion of being sees something demonic that destroys original identity and purity’.12 Far Eastern culture, on the other hand, draws no hard distinction between the copy and the original. Instead of objects being ‘things’, with ‘a unique position in time and space’, as Benjamin puts it, objects are traces and paths that are constantly evolving. Copies are not inferior to originals, because originals are always also copies of some sort or other. There is no ‘aura’ to the work of art. A", page: 3805 },
      { text: "Bitcoin was one of the first digital currencies, but it is also a type of digital scarcity, because it solved what was known as the ‘double spend’ problem. Double spending is an issue as old as digital cash: if I ‘spend’ a digital token, how do you, the recipient, know I haven’t made and kept a copy for myself? Banks solve this by acting as a go-between for the transfer of value from Ann to Bob; sending the money means updating entries in a central ledger. Bitcoin, a decentralised currency with no middleman, solves this problem with cryptographic proof. A shared ledger (called a blockchain) tracks tokens so that they cannot be copied. (Or, to be specific, the ledger entries are the tokens.) But instead of an entry encoding who owns or transfers digital tokens, it might also record the ownership and transfer of digital artworks, ideas, music, or source code.", page: 3832 },
      { text: "a buyer might also purchase a work of art because of what the act of purchasing says about them – culturally, socially, and economically. ‘Signalling’ plays a role in the acquisition of collectible coins and of virtual loot in online games. And signalling has always played a role in art markets. Buyers do not just buy a beautiful object or an asset they hope will grow in value; buying art is a self-investment in a world where social capital predicts economic returns. Using this framework, the purchase of the Celestial Cyber Dimension cryptokitty might have had several different motivations: the desire to possess an artwork that the buyer finds meaningful, to make a strategic investment in a niche market – or to acquire ‘bragging rights’, as a strategic investment in the buyer’s own social and economic reputation going forward.", page: 3880 },
      { text: "What gets purchased at an art auction? The buyer’s own sense of self-worth? Their standing in the community? A token of a moment they helped to make happen? In the art auction, Jean Baudrillard writes, money (exchange value) gets turned into prestige (sign value). The art auction is unique for Baudrillard because it is an act of consumption where money (a sign) is exchanged for art (another sign).19 In this sense, the label ‘art’ is the ideal ideological mechanism – a licence to print your own money. And in this moment of consumption, ‘exchange’ and ‘use’ value are no longer economically correlated. Use value is put out of play. Money is turned into a sign of prestige (a.k.a. a bragging right) that might be wagered in the future for greater financial returns. The sale of art becomes less about the material properties of a work, as we saw with the sale of works by Dan Flavin and Ibrahim Mahama in the previous chapter. Its material properties, its location in time and space – these are not so important. What matters more is the degree of information – call it vibes, bragging, hype, buzz, spectacle – that can be generated around it.", page: 3900 },
      { text: "Friends with Benefits (FWB) is a decentralised autonomous organisation or DAO, an artist collective that uses blockchain tokens to unlock access, manage payments, and collectively vote on group investments.", page: 3909 },
      { text: "Users must buy into the FWB token to become a member of the collective. Like medieval tokens that conferred access to exclusive orgies and feasts, the FWB tokens unlock access to select gatherings and parties. Five FWB tokens makes someone a local member, giving them access to the group’s Discord. Global membership costs seventy-five FWB tokens, plus a formal application and interviews with the FWB Host Committee. If membership is approved, this buy-in gives the member access to an NFT gallery and to special ‘token-gated’ events. For the Friends with Benefits DAO, the benefit is in what sociologist Pierre Bourdieu called ‘social capital’ and ‘cultural capital’, to put a name to the economic clout of amorphous connections, good vibes, and good taste.21 And, like the art auction, the DAO works to seize the floating value of these benefits and turn them into economic capital. Founder Alex Zhang compares the FWB DAO to the merchant class of Venice in Renaissance Europe (the heads of state were even called doges). With Friends with Benefits, ‘what you’re getting is vibes’, he says: ‘This token is starting to reflect some of the value of those vibes’:", page: 3928 },
      { text: "only official FWB members can earn \\$FWB as a reward for participation. This is a way of bolstering the value we provide to each other as an engaged and close-knit community.22 The token traded on vibes. The vibe is distinctly Burning Man: self-congratulatory counter-culture meets extreme libertarian economic privilege. Like Burning Man, the group also had the ambition to create their own exclusive gatherings. One of these events was a three-day festival in the grounds of Idyllwild Arts Academy, a private boarding school two hours’ drive from Los Angeles. Among the attractions were a digital gallery hosted by OpenSea, a natural wine garden, sound baths with mushroom tea, pool parties, and star-gazing sessions.23 Anthropologist Kelsie Nabben was among the attendees invited to an intimate acoustic concert by musician James Blake in the middle of a forest. She listened to Blake play the piano and she heard earnest discussions about how to save crypto before the assholes come in and ruin it.24", page: 3940 },
      { text: "Friends with Benefits did not just tokenise art – it tokenised prestige, vibes, bragging rights, membership with the in-crowd. People were buying in in the hope that they would belong, but also make money. Kind of like art, honestly.", page: 3958 },
      { text: "Artist Kevin Abosch is the creator of Forever Rose, a token called ROSE on the Ethereum blockchain that derives from Abosch’s photograph of a rose. ‘It doesn’t exist in a physical sense’, Abosch explained to me. ‘It is the result of using block-chain technology to create a virtual proxy of the photographic work.’32 Unlike Monegraph and Maecenas, then, which link works of art that exist in the digital or physical sense, the ethereal Forever Rose has no physical presence, or even a virtual presence, only a monetary one. Abosch’s works are not tokens associated with physical or digital works of art, then, but works of art or collectibles that, like a centenary coin, consist of the tokens themselves and the smart contracts they encapsulate. The artist suggests that this work, as well as a similar project, Potato #345, poses crucial questions concerning the relationship between objecthood, scarcity, and value.", page: 3998 },
      { text: "The cryptokitty or the Forever Rose has value as a set of rights to a financial asset. The buyer does not purchase an ‘image’, or even an ‘idea’, so much as a cryptographic certificate of authenticity that can be used to speculate on the future performance of the token. The aesthetic significance of a cartoon cat or a watercolour of an Ethereum logo is not the point.", page: 4018 },
      { text: "As part of a series of interviews between 2015 and 2021, I spoke to Kevin McCoy about the business models he envisioned emerging from blockchain. Clearly, he didn’t see it as a system for property rights? Rather than owning, McCoy argued, blockchain was ‘more appropriate for bragging rights, where it’s about building community, fans, or supporters’. Could ‘bragging rights’ be the new business model for artists, I wondered. ‘Yes’, McCoy said. ‘Because it fits well into the complex ecosystems of support that artists are relying on now – things like micropayments and Patreon. And it could fit really well into the work of influencers, fans, content creators, y’know – a way to build a brand, create VIPs or special relationships.’39 Bored Ape seemed to recognise this intuitively when it speculated that any use of the content would simply grow its brand. As with other memes, exchange value would grow through virality, not scarcity.", page: 4049 },
      { text: "McKenzie Wark asks us to consider how the very properties of spreadability that characterize digital objects can be turned to advantage to make them collectable as well … Paradoxically, an object whose image is very widely spread is a rare object, in the sense that few objects have their images spread widely. This can be exploited to create value in art objects that are not in the traditional sense rare and singular. The future of collecting may be less in owning the thing that nobody else has, and more in owning the thing that everybody else has.42 The artwork is not a thing, but a derivative of hype and network effects. In this sense, NFTs are not radically disrupting the art market. They are ‘the market, perfected’.", page: 4068 },
      { text: "Millennials and Gen Zs were raised to be entrepreneurs of the self, to believe that if they simply worked and studied hard enough, success and security were waiting in their futures. Failure was a personal blight for refusing to invest your time wisely, for refusing to grind hard enough. Many now feel they have been sold worthless promises. Instead of speaking about investment in their university education, my students speak to me of investing in NFTs or on retail sites to try and win a home, or of buying a little breathing space, a little time to make their art. Security isn’t coming with study and safe choices, so why not go all-in on a long shot?", page: 4087 },
      { text: "as the game grew popular, the price of the NFT Axies inflated to the point where it cost incoming players as much as \\$1,500 just to buy into the game. Because this was prohibitively expensive for many, a system emerged whereby existing owners rented fractional reserves of their assets to others. A second tier could work someone else’s Axies and take a cut. Owners are ‘managers’, and workers are – somewhat euphemistically – called ‘scholars’. Managers recruit scholars on message boards, set daily quotas and a profit split, usually between 30 and 50 per cent. In February 2023, Sky Mavis partnered with MetaLend, a company that allows AXS holders to borrow against their in-game NFT assets. In contrast to Vadim’s dad, one Philippine father is encouraging his sons to enter the business: ‘in the next 12 years, my kids won’t need a college degree, they’ll just need to know how to create value in virtual worlds’.", page: 4165 },
      { text: "Today, virtual assets are worth more than \\$100 billion each year: things like characters, weapons, clothing, and appearance modifications (‘skins’), real estate, and access passes. The most common purchases are skins and cosmetic segments, followed by seasonal and battle passes.", page: 4178 },
      { text: "1997, Origin Systems launched Ultima Online, the first MMO. At the same time, a currency crisis prompted Asian governments to invest in broadband to stimulate economic development. Many citizens who lost their jobs took to gaming. The more informal practice of trading to level up transformed into a ‘gold farming’ industry, where wealthy gamers outsourced their play to East Asia. They bought virtual items, and sometimes whole accounts with tokens attached. Gold farmers played in sweatshop-meets-internet-café conditions. The time these players spent was changed out for disposable income from the West on internet resale sites. A Guardian article reported that prison guards were forcing Chinese inmates to gold farm in twelve-hour shifts. Miners were allegedly beaten with plastic pipes if they failed to meet their daily quotas.11", page: 4215 },
      { text: "real money, in the context of a game, threatens the carefully constructed boundaries of play – like handing over €20 in the middle of a game of Monopoly. Game economists call this ‘the magic circle’ – the sense that gateways from the virtual into the real economy (or into other, conflicting virtual economies) threaten the internal logic of the game environment. All the talk of quotas or grinding does not square with the fact that a game is supposed to be just for fun. Players who ‘work’ in virtual worlds, then, instead of simply playing in them, ruin the fun for everyone else. Their single-minded purpose disrupts ‘normal’ play.", page: 4246 },
      { text: "The derogatory name for players who do not invest in extras, Will tells me, is ‘no-skins’. Skins are limited-edition drops – items are available for a short period of time, and then they’re gone. Will speaks wistfully of ‘the Renegade Raider’ and ‘the Reaper’ – two skins that are no longer available, but which tell you that the player in your sights is OG or ‘original gangster’. Some skins are so desirable that they work as their own currency outside the gaming platform. In a practice known as ‘skin betting’, valuable skins are held as tokens in a virtual wallet and used as collateral for gambling on the internet. A dragon lore skin from the game Counter Strike: Global Offensive (CS:GO) might be worth \\$61,000 dollars. Marketplaces for skins include skins.cash, a platform where an automated bot buys skins for credit that can be cashed out into money.", page: 4288 },
      { text: "Will also describes saving to get enough V-Bucks to buy ‘a really cool neck tattoo’, so that more experienced players in Fortnite would stop blowing him up in the first few seconds. Being a ‘no skins’ player singled Will out as an easy target for players looking to build their standing in the game, while a rare skin would signal that he might be best left alone. The tattoo was purely cosmetic, but it was also a reputational investment – a prestige item that he hoped would indicate that he was now a serious player. Luc Barthelet agrees. In Fortnite, ‘the “game” is mostly about reaching status when you’re a noob’. The right token says you have skin in the game.", page: 4304 },
      { text: "They are like Klein’s Zones of Immaterial Pictorial Sensibility, I think – the invisible plots of land by the Seine that the artist tokenised and sold for gold: unreal estate, most stand empty.", page: 4360 },
      { text: "‘As soon as the token could be traded for US dollars, regulations started to apply’, Ondrejka says. ‘People built games of chance inside Second Life using scripting language. You get very interesting phone calls from the state attorney general saying: “It sure looks like you have gambling going on?” … – “Noooh, no, sir, we certainly do not. And we will definitely go crack down on that through policy.” ’ Likewise, people were building banks and issuing Linden loans. The company CEO, Philip Rosedale, was quoted in an article comparing Linden dollars to the era of wildcat banking. ‘It turns out that the SEC doesn’t think that’s very funny, either.’27 One such bank, Ginkgo Financial, offered interest rates of as much as 70 per cent per annum for a personal account, denominated in Linden dollars. Some claimed that the interest returns were propped up by new entrants to what was essentially a pyramid scheme. Others believed the bank’s investments lay in Second Life’s in-game casinos. When Linden announced a ban on in-world gambling in 2007, it halved the economy and triggered a run on Ginkgo Financial. The bank collapsed. In 2008, Second Life prohibited fixed-interest accounts for all banks without a real-world charter. Banks without the necessary licensing closed, or were converted to stocks. Linden Labs acquired the necessary licences to be a payment processor, jumping through the same hoops that PayPal had cleared five or six years before.", page: 4427 },
      { text: "Linden was the first virtual world to give IP to creators. It invited Lawrence Lessig, a legal scholar and the founder of Creative Commons licensing, as an advisor in 2002. ‘And Larry was like “You know, it’s kind of stupid to ask people to create things and not allow them to own it.” ’28 In every other EULA of the time, it was typical for the company to take ownership of everything users created on its platform. ‘If you composed a love poem over chat in World of Warcraft?? WoW owned it.’ It was the first time that a game-like environment had decided to treat itself as a creativity product. ‘Because, obviously, Microsoft Word don’t claim ownership of the text you write on their software … although the rumours are that they considered it more than once …’", page: 4440 },
      { text: "Compared to the lively economies of Second Life or even Final Fantasy, where you can earn a decent living as an interior decorator, the feeling of Decentraland is more speculative. Think of the Louvre Abu Dhabi – a culture cleaved off and dropped in the middle of a desert. Or maybe it’s like Burning Man after 2015: a safe, monetised version of what was once a genuine subculture. And indeed, you too will go to Burning Man. In the metaverse.", page: 4498 },
      { text: "The term ‘metaverse’, like the term ‘blockchain’, is both vague and capacious, mashing together visions for the future of gaming and augmented reality with scenes from Ready Player One. For all its varied meanings, most agree it refers to one place, in the sense that the internet is one place with shared standards and multiple offerings. Each platform wants to be the monopoly – a hermetically sealed ‘magic circle’ where, as Mitch Zamara, a metaverse game designer for the pay-to-earn game Million on Mars, puts it, ‘You are the central bank, you are the regulator, you are the Federal Reserve. You get to do everything.’", page: 4511 },
      { text: "Alan Butler is probably best known for Down and Out in Los Santos, a video work that uses the in-game camera to capture 3D-rendered homeless people and desolate landscapes in Grand Theft Auto. While the poor of Los Santos are loosely rendered, Butler argues that it is still possible to have ‘real emotional experiences’ when interacting with them. ‘This might sound sad and geeky, but it’s true. The characters are aware of my presence as I photograph them: sometimes they ignore me, other times I’m attacked and have to defend myself. They chatter to each other, they share alcohol and cigarettes, they ask for money to buy drugs. Programmed to self-identify, they congregate with those in similar social situations to themselves.’37 Butler’s work takes place in game economies, but he is drawn to the stuff around the edges that the game classes as ‘worthless’.", page: 4544 },
      { text: "In 2006, the average Second Life avatar consumed more electricity than the average Brazilian. In 2019, data centres surpassed air traffic in terms of carbon emissions.", page: 4563 }
    ]
  },
  {
    title: "Momo",
    author: "Michael Ende",
    coverImageUrl: "/book_covers/momo.jpg",
    description: "A timeless fantasy about a girl who fights to save her community from the 'Men in Grey'—time thieves who rob people of their joy and leisure.",
    link: "https://www.goodreads.com/book/show/68811.Momo",
    highlights: [
      { text: "Momo was staring at them wide-eyed and neither of the two could quite understand her gaze. Was she laughing at them both on the inside? Or was she sad? Her face betrayed nothing, but the two men suddenly felt as if they were seeing themselves in a mirror, and they became ashamed.", page: 245 },
      { text: "Another time, a small boy brought her a canary that wouldn’t sing. This was a much more difficult assignment for Momo. She had to listen to it for an entire week before it finally began to trill and whistle again.", page: 277 },
      { text: "Ever since he had met Momo, though, his tales had grown wings, and whenever Momo was around listening to him, his imagination began to blossom like a garden in spring. Children and adults alike crowded around, and he began telling stories that spanned days or weeks and which he therefore broke into many installments. What’s more, he listened to himself with the same suspense and curiosity as the others, because even he had no idea where his imagination would lead him.", page: 582 },
      { text: "“I know for sure that they aren’t. The Magical Mirror only makes you mortal when you look into it alone, but if you look into it with someone else, then you become immortal again. That’s what the two of them did.”", page: 742 },
      { text: "Everyone is in on it and everyone knows what it is, but very few people ever think about it. Most people just take it for granted without wondering the slightest bit about it. The secret is time. We have calendars and clocks to measure time, but they mean little: everyone knows a single hour can seem like an eternity or pass in a flash. It all depends on what we experience in that hour. Time is the very essence of life itself, and life exists in our hearts.", page: 772 },
      { text: "“Without a doubt, it is! It’s so stupid of me not to have already begun to save. Only now do I see it fully, and I have to admit, I’m ashamed.” “Well,” replied the gray man softly, “you have absolutely no reason to be. It’s never too late. If you want, you could even sign up today. It’s worth it, you’ll see.” “You bet I will!” yelled Mr. Fusi. “What do I have to do?” “But, my friend,” answered the agent, raising his eyebrows, “surely you already know how to save time! In brief, you have to work faster and stop doing anything superfluous. Instead of devoting half an hour to your customers, only spend fifteen minutes with them. Avoid time-wasting conversations. Reduce the hour you spend with your mother to half an hour. Better yet, just put her in a good, cheap retirement home where she’ll be taken care of. That way you’ll already be winning an hour every day. Get rid of the useless parakeet! If you must visit Ms. Daria, only do so once every two weeks. Get rid of your fifteen-minute nightly review of the day’s events, and don’t waste so much of your precious time singing, reading, or going out with your so-called friends. Incidentally, I also recommend that you get a big, accurate clock for your shop so you can keep an eye on your apprentice’s work.”", page: 912 },
      { text: "Mr. Fusi looked after him, rubbing his forehead. He was gradually becoming warm again, but he felt sick and miserable. The dense blue smoke from the agent’s small cigar hung thick in the air for a long time before dissipating. Not until after the smoke had dispersed did Mr. Fusi begin to feel better. But as it faded, so did the figures chalked on the mirror, and when they had finally vanished altogether, so too had Mr. Fusi’s memory of the gray man. But it was only his memory of the visitor that had vanished, not his memory of the decision. He now simply thought he had come to this new resolution all by himself. His intention—to save time in order to begin another life in the future—held fast in his soul like a barbed hook.", page: 936 },
      { text: "Daily advertisements on the radio, on the television, and in the newspapers revealed and praised the advantages of new time-saving devices that would one day leave people free to live the “proper” life. There were posters stuck on the walls of houses and billboards throughout the city, all displaying different images of prosperity. Underneath them, in bright neon letters, stood slogans like: EVERYTHING RUNS BETTER ON SAVED TIME! SAVING TIME FOR THE FUTURE! MAKE MORE OF YOUR LIFE—SAVE TIME!", page: 959 },
      { text: "Nobody seemed to notice that by saving time they were actually losing something much more important. These people didn’t want to believe that their lives were becoming poorer and poorer, colder and more monotonous. Only the children seemed to notice because no one had time for them anymore. But time is life, and life exists in our hearts, and the more of it that the people saved, the less they actually had.", page: 987 },
      { text: "“My parents told me that you’re all just slackers and good-for-nothing day-stealers,” Paolo explained. “ ‘You waste god’s time,’ they said, ‘that’s why you have so much. And because there are too many like you, other people have less and less time,’ they said. And I shouldn’t come here anymore because if I do I’ll just become like you.”", page: 1081 },
      { text: "crestfallen.", page: 1109 },
      { text: "The gray man sat it down next to Barbiegirl and began to explain. “This is Barbieboy! There are just as many accessories for him as there are for Barbiegirl. And when all of that gets boring, Barbiegirl has another friend, and she also has unique accessories that suit only her. And Barbieboy also has a friend, and that friend has other friends and girlfriends. You see? You never have to be bored again because it goes on and on, and there’s always something new to wish for.”", page: 1282 },
      { text: "“The only thing that matters in life,” the gray man went on, “is success, making something of yourself, owning things. Anyone who goes further, makes more of himself, and earns more money than other people will get all the rest automatically: friendship, love, marriage, etc. Now, you say you love your friends. Let’s examine that statement objectively.”", page: 1321 },
      { text: "“We must remain unrecognizable. No one can know that we exist and what we do... We make sure that no one remembers us... We can only do our work as long as no one knows who we are... exhausting work, stealing people’s time—hours, minutes, and seconds... all the time that they save is actually lost to them... we take it for ourselves... we store it up... we need it... we hunger for it... ah! You have no idea how valuable your time is! But we, we know, and we suck it away from you... suck you dry... and we always need more... always more... always more...”", page: 1352 },
      { text: "“Couldn’t you easily just make it so that the time thieves can’t steal anymore time?” “No, I cannot,” answered Master Hora. “People must decide for themselves what to do with their time, just as they must defend it themselves. I can only give it to them.”", page: 2284 },
      { text: "“Are you Death?” Master Hora smiled and remained silent for a while before he answered. “If people only knew what death was they wouldn’t be so afraid of it; and if they weren’t afraid of it, no one would be able to steal their time anymore.”", page: 2299 },
      { text: "“WON’T SEE A SOUL” came Cassiopeia’s laconic reply.", page: 3318 },
      { text: "“In the beginning you don’t notice much, but then, all of a sudden, you’re not in the mood to do anything at all. Nothing interests you anymore, and you begin to waste away. But this disinterest doesn’t just disappear after a while—no, it gets worse from day to day, from week to week. You feel sadder and more morose, emptier inside, and increasingly unhappy with yourself and with the world in general. Then, after a while, even that feeling goes away, and you don’t feel anything at all. You become indifferent, gray, and the whole world begins to feel foreign and strange. Nothing matters to you anymore. There’s no more fury, no more passion; you can’t feel happiness or sadness anymore; you forget how to laugh and how to cry. Then everything is cold, and you can no longer love. Once it’s come to that, the sickness is no longer treatable. There’s no more going back. You scurry around with an empty, gray face, and then you become just like one of the gray men. Indeed, then you are one of them. The disease has a name: it’s called Deadly Apathy.”", page: 3481 }
    ]
  },
  {
    title: "Vestoj",
    author: "Anja Aronowsky Cronberg",
    coverImageUrl: "/book_covers/vestoj.jpg",
    description: "A research platform and journal that examines the relationship between fashion, culture, and identity, providing a critical and intellectual perspective on why we wear what we wear.",
    link: "https://vestoj.com/about/",
    highlights: [
      { text: "If culture were fungible, like economic capital, all one needs is to have it. But if its value is conditional on the identity of the holder, then the situation is quite different. We can't assume that if the dominated could just 'have' the right cultural, social, or symbolic capital, then equality would follow. Doing so, in fact, tends to blame the dominated for their condition. They just have the wrong tastes. But what if having a certain kind of cultural capital fails to yield the same amount for you-not because of what you know but because of who you are? Or what if you could add value to a culture genre not because of how you do it, but because what it means for you to do it? Your power, not the quality of your performance, makes the devalued object, somehow, more valuable", page: null }
    ]
  }];

const screensData = [
  {
    title: "Eat Drink Man Woman",
    subtitle: "Movie",
    coverImageUrl: "/screens/eat_drink_man_woman.jpg",
    description: "Ang Lee's beautiful exploration of family, tradition, and change in Taipei. A master chef and his three rebellious daughters navigate life's complexities around the Sunday dinner table.",
    link: "https://www.imdb.com/title/tt0111797/",
    trailerId: "l7pKpO8NErU"
  },
  {
    title: "Atlanta",
    subtitle: "TV Series",
    coverImageUrl: "/screens/atlanta.jpg",
    description: "Donald Glover's surreal and genre-bending series following Earn and his cousin Paper Boi through the Atlanta rap scene. A poignant, hilarious, and often dreamlike reflection on modern life.",
    link: "https://www.imdb.com/title/tt4288182/",
    trailerId: "CetGXHU5aOA"
  },
  {
    title: "The Tale of Tales",
    subtitle: "Movie (Short)",
    coverImageUrl: "/screens/tale_of_tales.jpg",
    description: "A poetic and soulful Russian animation masterpiece by Yuriy Norshteyn. It is widely considered one of the greatest animated films of all time, weaving together memory, war, and the passing of time.",
    link: "https://www.imdb.com/title/tt0079986/",
    trailerId: "wAw6r9-BIt8"
  },
  {
    title: "Waking Life",
    subtitle: "Movie",
    coverImageUrl: "/screens/waking_life.jpg",
    description: "A man shuffles through a dream meeting various people and discussing the meanings and purposes of the universe.",
    link: "https://www.imdb.com/title/tt0243017/",
    trailerId: "edrGozs6W_I"
  },
  {
    title: "My Dinner with Andre",
    subtitle: "Movie",
    coverImageUrl: "/screens/my_dinner_with_andre.jpg",
    description: "A fascinating, feature-length conversation between two friends in a New York restaurant. Wallace Shawn and Andre Gregory discuss life, art, and the nature of reality in this intimate cinematic experiment.",
    link: "https://www.imdb.com/title/tt0082783/",
    trailerId: "nC2c1sfFHEg"
  },
  {
    title: "Paprika",
    subtitle: "Movie",
    coverImageUrl: "/screens/paprika.jpg",
    description: "Satoshi Kon's mind-bending journey into the world of dreams. When a device that allows therapists to enter patients' dreams is stolen, a young therapist must hunt down the thief through a psychedelic dreamscape.",
    link: "https://www.imdb.com/title/tt0851578/",
    trailerId: "anu2IrsUlVs"
  },
  {
    title: "The Act of Killing",
    subtitle: "Movie",
    coverImageUrl: "/screens/act_of_killing.jpg",
    description: "A chilling and groundbreaking documentary where former Indonesian death squad leaders reenact their mass killings in the style of their favorite cinematic genres.",
    link: "https://www.imdb.com/title/tt2375605/",
    trailerId: "6GiqYLrJBG0"
  },
  {
    title: "Spirited Away",
    subtitle: "Movie",
    coverImageUrl: "/screens/spirited_away.jpg",
    description: "Hayao Miyazaki's enchanting masterpiece about a young girl who becomes trapped in a magical world of spirits and bathhouses. A summit of animated storytelling and visual imagination.",
    link: "https://www.imdb.com/title/tt0245429/",
    trailerId: "ByXuk9QqQkk"
  },
  {
    title: "The Holy Mountain",
    subtitle: "Movie",
    coverImageUrl: "/screens/the_holy_mountain.jpg",
    description: "A surrealist masterpiece by Alejandro Jodorowsky. The Alchemist assembles a group of people from all walks of life to represent the planets in the solar system. The intent is to put them through strange mystical rites and divest them of their worldly baggage before embarking on a journey to Lotus Island to ascend the Holy Mountain and displace the immortal gods who secretly rule the universe.",
    link: "https://www.imdb.com/title/tt0071615/",
    trailerId: "DSON8vHpxzY"
  },
  {
    title: "Seven Samurai",
    subtitle: "Movie",
    coverImageUrl: "/screens/seven_samurai.jpg",
    description: "Akira Kurosawa's epic masterpiece about seven Ronin hired to protect a small village from bandits. The definitive action-drama that changed cinema forever.",
    link: "https://www.imdb.com/title/tt0047478/",
    trailerId: "wJ1TOratCTo"
  },
  {
    title: "Jujutsu Kaisen",
    subtitle: "TV Series",
    coverImageUrl: "/screens/jujutsu_kaisen.jpg",
    description: "A high-octane dark fantasy series where high schooler Yuji Itadori enters a world of Curses and Sorcerers. A masterclass in modern shonen animation and choreography.",
    link: "https://www.imdb.com/title/tt12343534/",
    trailerId: "pkKu9hLT-t8"
  },
  {
    title: "Oldboy",
    subtitle: "Movie",
    coverImageUrl: "/screens/oldboy.jpg",
    description: "Park Chan-wook's visceral and stylistic revenge thriller. After being imprisoned for 15 years without explanation, a man is suddenly released and given five days to find his captor.",
    link: "https://www.imdb.com/title/tt0364569/",
    trailerId: "tAaBkFChaRg"
  },
  {
    title: "The Firemen's Ball",
    subtitle: "Movie",
    coverImageUrl: "/screens/firemens_ball.jpg",
    description: "Miloš Forman’s sharp satirical comedy of the Czech New Wave. A party thrown by a small-town fire department descends into chaotic bureaucracy and theft—a beautiful example of the functioning of ideology, where the ritual of the system is desperately maintained even as it's being dismantled from within.",
    link: "https://www.imdb.com/title/tt0061781/",
    trailerId: "kGMakTwMRoY"
  },
  {
    title: "In the Mood for Love",
    subtitle: "Movie",
    coverImageUrl: "/screens/mood_for_love.jpg",
    description: "Wong Kar-wai's lush and melancholic romance set in 1960s Hong Kong. Two neighbors form a delicate bond after discovering their spouses are having an affair.",
    link: "https://www.imdb.com/title/tt0118694/",
    trailerId: "m8GuedsQnWQ"
  },
  {
    title: "Black Mirror",
    subtitle: "TV Series",
    coverImageUrl: "/screens/black_mirror.jpg",
    description: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide. Each episode is a sharp, suspenseful tale exploring themes of contemporary techno-paranoia.",
    link: "https://www.imdb.com/title/tt2085059/",
    trailerId: "zLZHdK6l55I"
  },
  {
    title: "Freaks and Geeks",
    subtitle: "TV Series",
    coverImageUrl: "/screens/freaks_and_geeks.png",
    description: "A cult-classic coming-of-age comedy-drama that brilliantly captures the awkwardness and struggles of high school through the eyes of two distinct groups of teenagers in 1980.",
    link: "https://www.imdb.com/title/tt0195159/",
    trailerId: "E0oJ-uYWakw"
  },
  {
    title: "The Office",
    subtitle: "TV Series",
    coverImageUrl: "/screens/the_office.jpg",
    description: "The definitive mockumentary following the daily lives of office employees at the Dunder Mifflin Scranton branch. A masterclass in cringe comedy, character development, and heart.",
    link: "https://www.imdb.com/title/tt0386676/",
    trailerId: "-C2z-nshFts"
  },
  {
    title: "Brazil",
    subtitle: "Movie",
    coverImageUrl: "/screens/brazil.jpg",
    description: "Terry Gilliam's surrealist masterpiece about a low-level bureaucrat who becomes an enemy of the state while pursuing the woman of his dreams in a dystopian, retro-future world.",
    link: "https://www.imdb.com/title/tt0088846/",
    trailerId: "ZKPFC8DA9_8"
  },
  {
    title: "Attack on Titan",
    subtitle: "TV Series",
    coverImageUrl: "/screens/attack_on_titan.jpg",
    description: "In a world where humanity lives behind massive walls to protect themselves from man-eating Titans, young Eren Jaeger vows to eliminate the giants after they destroy his home and kill his mother.",
    link: "https://www.imdb.com/title/tt2560140/",
    trailerId: "MGRm4IzK1SQ"
  },
  {
    title: "Fleabag",
    subtitle: "TV Series",
    coverImageUrl: "/screens/fleabag.jpg",
    description: "A dry-witted, unfiltered woman navigates life and love in London while trying to cope with tragedy. A brilliant, fourth-wall-breaking exploration of grief, family, and modern life.",
    link: "https://www.imdb.com/title/tt5687612/",
    trailerId: "I5Uv6cb9YRs"
  },
  {
    title: "Mad Men",
    subtitle: "TV Series",
    coverImageUrl: "/screens/mad_men_new.png",
    description: "A drama about one of New York's most prestigious ad agencies at the beginning of the 1960s, focusing on one of the firm's most mysterious but extremely talented ad executives, Donald Draper.",
    link: "https://www.imdb.com/title/tt0804535/",
    trailerId: "sIGuUV252i4"
  },
  {
    title: "Mr. Robot",
    subtitle: "TV Series",
    coverImageUrl: "/screens/mr_robot_new.jpg",
    description: "A psychological techno-thriller following Elliot Alderson, a cybersecurity engineer and hacker recruited by a mysterious anarchist to join a group of hacktivists aiming to destroy all debt records.",
    link: "https://www.imdb.com/title/tt4158110/",
    trailerId: "p0flghBLUSE"
  },
  {
    title: "Chernobyl",
    subtitle: "TV Series",
    coverImageUrl: "/screens/chernobyl_liquidator.jpg",
    description: "A harrowing dramatization of the 1986 nuclear disaster and the selfless heroes who fought to contain it. A masterclass in tension, atmosphere, and the cost of institutional denial.",
    link: "https://www.imdb.com/title/tt7046012/",
    trailerId: "s9APLXM9Ei8"
  },
  {
    title: "Breaking Bad",
    subtitle: "TV Series",
    coverImageUrl: "/screens/breaking_bad_s5.jpg",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    link: "https://www.imdb.com/title/tt0903747/",
    trailerId: "VFkjBy2b50Q"
  },

  {
    title: "SimCity 4",
    subtitle: "Game",
    coverImageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/24780/library_600x900_2x.jpg",
    description: "The gold standard of city simulation. SimCity 4 allows you to create and manage sprawling metropolitan regions, balancing complex infrastructure, economics, and the needs of your Sims.",
    link: "https://store.steampowered.com/app/24780/SimCity_4_Deluxe_Edition/",
    trailerId: "lxaJXyF4qbg"
  },
  {
    title: "Cities: Skylines II",
    subtitle: "Game",
    coverImageUrl: "/screens/cities_skylines_2.jpg",
    description: "A modern take on the classic city builder. Cities: Skylines provides deep simulation of urban life, traffic, and logistics, giving players total control over every aspect of their city's development.",
    link: "https://www.paradoxinteractive.com/games/cities-skylines/about",
    trailerId: "7vlKoMi4Qr0"
  },
  {
    title: "RollerCoaster Tycoon Classic",
    subtitle: "Game",
    coverImageUrl: "/screens/rct_classic.jpg",
    description: "The peak of the theme park management series. Build incredible coasters, manage your park's finances, and watch as guests experience your creations in full 3D.",
    link: "https://www.frontier.co.uk/games/rollercoaster-tycoon-3",
    trailerId: "5d9Fe7XUa1c"
  },
  {
    title: "Manor Lords",
    subtitle: "Game",
    coverImageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1363080/library_600x900_2x.jpg",
    description: "A medieval city builder with deep social and economic simulation and large-scale tactical battles. Manor Lords aims to provide a realistic and high-fidelity 14th-century experience.",
    link: "https://manorlords.com/",
    trailerId: "hhk4HAxLhq8"
  },
  {
    title: "Banished",
    subtitle: "Game",
    coverImageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/242920/library_600x900_2x.jpg",
    description: "A challenging city builder where you lead a group of exiled travelers to restart their lives in a new land. Every individual matters in this survival-focused management game.",
    link: "http://www.shiningrocksoftware.com/game/",
    trailerId: "Ls8FBFFjMxk"
  },
  {
    title: "Red Dead Redemption 2",
    subtitle: "Game",
    coverImageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/library_600x900_2x.jpg",
    description: "Rockstar's epic tale of life in America's unforgiving heartland. An unparalleled open-world experience following the decline of the outlaw era through the eyes of Arthur Morgan.",
    link: "https://www.rockstargames.com/reddeadredemption2",
    trailerId: "gmA6MrX81z4"
  },
  {
    title: "The Sims 2",
    subtitle: "Game",
    coverImageUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co3dm5.jpg",
    description: "The groundbreaking life simulation that introduced DNA, generations, and complex life goals. Manage every detail of your Sims' lives from cradle to grave in this timeless classic.",
    link: "https://www.ea.com/games/the-sims/the-sims-2",
    trailerId: "EUc_VDWRAQo"
  },
  {
    title: "The Elder Scrolls V: Skyrim",
    subtitle: "Game",
    coverImageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/489830/library_600x900_2x.jpg",
    description: "The definitive open-world fantasy epic. Skyrim provides an unparalleled sense of freedom and discovery in a vast, cold land of dragons and ancient magic.",
    link: "https://store.steampowered.com/app/489830/The_Elder_Scrolls_V_Skyrim_Special_Edition/",
    trailerId: "JSRtYpNRoN0"
  },
  {
    title: "The Elder Scrolls IV: Oblivion",
    subtitle: "Game",
    coverImageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/22330/library_600x900_2x.jpg",
    description: "A monumental entry in the Elder Scrolls series. Oblivion's lush world and deep questlines set a new standard for Western RPGs, with a sense of wonder that still holds up.",
    link: "https://store.steampowered.com/app/22330/The_Elder_Scrolls_IV_Oblivion_Game_of_the_Year_Edition/",
    trailerId: "wFJ3PZuAjK4"
  },
  {
    title: "Tony Hawk's Pro Skater 3",
    subtitle: "Game",
    coverImageUrl: "/screens/tony_hawk_3.jpg",
    description: "The pinnacle of arcade skateboarding. With its perfect combo system and iconic levels, THPS3 remains a masterpiece of flow and frantic fun.",
    link: "https://www.ign.com/games/tony-hawks-pro-skater-3",
    trailerId: "yoSQOUKIUI4"
  },
  {
    title: "Spyro 2: Ripto's Rage!",
    subtitle: "Game",
    coverImageUrl: "/screens/spyro_2.jpg",
    description: "The purple dragon returns in this stunning high-definition remake. A nostalgic journey through vibrant worlds filled with gems, dragons, and charm.",
    link: "https://store.steampowered.com/app/996580/Spyro_Reignited_Trilogy/",
    trailerId: "TYxwR7K6HOA"
  },
  {
    title: "Crash Bandicoot",
    subtitle: "Game",
    coverImageUrl: "/screens/crash_bandicoot.jpg",
    description: "The quintessential 90s platformer, meticulously rebuilt for a new generation. Crash's frantic energy and challenging levels are as addictive as ever.",
    link: "https://store.steampowered.com/app/731490/Crash_Bandicoot_N_Sane_Trilogy/",
    trailerId: "n_pwOxMhhGs"
  }
];

const audioData = [
  {
    title: "Ebb Tide",
    artist: "Houston & Dorsey",
    coverUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0219785e19807ee4b3b16d787e",
    previewUrl: "https://p.scdn.co/mp3-preview/5ea952771615233e1b7a6571e3194b3b50dfca93",
    spotifyUrl: "https://open.spotify.com/track/4Y2rMjoYvgcICDes0FGThm"
  },
  {
    title: "Crucify Your Mind",
    artist: "Rodríguez",
    coverUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02e7e1b574a9e6b9f26c7c3f49",
    previewUrl: "https://p.scdn.co/mp3-preview/ff014d1b28d5357b3518a3e329855f0f45a25a0b",
    spotifyUrl: "https://open.spotify.com/track/2Xn7NadvZ56D0B2D7x2CSL"
  },
  {
    title: "More Pressure",
    artist: "Kae Tempest, Kevin Abstract",
    coverUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024371d8e74bb30b536dfe8e61",
    previewUrl: "https://p.scdn.co/mp3-preview/0adcb33da7c5dc9445cea5d31b2edc3ad42c45a7",
    spotifyUrl: "https://open.spotify.com/track/0sMWdvSFBg1bVkzyszM819"
  },
  {
    title: "Thirty Two",
    artist: "Bullion",
    coverUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e023087cd31f21fc4aa4a2aa22e",
    previewUrl: "https://p.scdn.co/mp3-preview/427425c5f8ade3e1e8acf58a1ecf94c849ca306c",
    spotifyUrl: "https://open.spotify.com/track/5MRH2b0hfxZJLliGzYDVF3"
  },
  {
    title: "Song of Abayi",
    artist: "Emahoy Tsege Mariam Gebru",
    coverUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0253d13c60cbf8496025e414e8",
    previewUrl: "https://p.scdn.co/mp3-preview/a0d9ce04a77b36cec31ff9c97869103c255a7ee5",
    spotifyUrl: "https://open.spotify.com/track/185EiYT58r61hdnHxjKVzT"
  },
  {
    title: "Real",
    artist: "Il Quadro di Troisi",
    coverUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02203033e6119382dfb439dba4",
    previewUrl: "https://p.scdn.co/mp3-preview/d6b6c3add8935ba6fac1704679fdbfaabcf90d55",
    spotifyUrl: "https://open.spotify.com/track/0oGMCVv5C1ekUYrITfMoO5"
  },
  {
    title: "In Manhattan",
    artist: "Nation of Language",
    coverUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02fd4c94a03dcec8f7dc03b41f",
    previewUrl: "https://p.scdn.co/mp3-preview/411c8a142bc9817a4131c43ae6bfa476ba9d7671",
    spotifyUrl: "https://open.spotify.com/track/5DebUsH4CN4ByTe0xF0KPJ"
  },
  {
    title: "STORIE BREVI",
    artist: "Tananai, Annalisa",
    coverUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02b9e2109bbe77afec0e7af667",
    previewUrl: "https://p.scdn.co/mp3-preview/9f1912bae6034598a64f672b32464fe2e1eaa165",
    spotifyUrl: "https://open.spotify.com/track/5GZupy8zByqFmXvpwZ4JOC"
  },
  {
    title: "Mia Fora Thymamai",
    artist: "Stereomatic, Arleta",
    coverUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e021ec905c832508bbf5b1dd00d",
    previewUrl: "https://p.scdn.co/mp3-preview/3e58562f8e348479f333ca2b5b410b21272eaa40",
    spotifyUrl: "https://open.spotify.com/track/7042gwq346mwkEoU5q3bbT"
  },
  {
    title: "Turned Out I Was Everyone",
    artist: "SASAMI",
    coverUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02f679c91273efb30ce1c3b00d",
    previewUrl: "https://p.scdn.co/mp3-preview/12e7a959a54e8636bda1dd8609df5741587474cf",
    spotifyUrl: "https://open.spotify.com/track/6RDiDCAraT3tr31FtWi3C7"
  },
  {
    title: "Mad Rush",
    artist: "Philip Glass, Mark Steinbach",
    coverUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02c3d6121c7cff1060cda6da05",
    previewUrl: "https://p.scdn.co/mp3-preview/885bb7e07c5620487f8fd55d8c9420244e9d4204",
    spotifyUrl: "https://open.spotify.com/track/1gcBvM73U5k2t75JXfcrkf"
  },
  {
    title: "Solo? Repeat!",
    artist: "Anne Müller",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273bddc6ec4f4f4644e6fd78815",
    previewUrl: "https://p.scdn.co/mp3-preview/ab40f39f9e4e66e67a43fe407b9c3e77779b30ac",
    spotifyUrl: "https://open.spotify.com/track/4rpuwusdTpMytfW6lbeqHe"
  },
  {
    title: "O Superman",
    artist: "Laurie Anderson",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273588b07fde7427a6b8e2614fe",
    previewUrl: "https://p.scdn.co/mp3-preview/b4f545b91656bed8b2259fc374d74d7edddf8c15",
    spotifyUrl: "https://open.spotify.com/track/421Gp1eSmOIcD6alTWowFR"
  },
  {
    title: "Danza del altiplano",
    artist: "Tom Kerstens",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273c7f2f30e9ceee4abc6b102e8",
    previewUrl: "https://p.scdn.co/mp3-preview/3daee45651f587db82549e18e69de45baf02c74d",
    spotifyUrl: "https://open.spotify.com/track/0Wbwtdm59r22Zj0hDI9VYk"
  },
  {
    title: "Again",
    artist: "The George Kaplan Conspiracy, Gabriel Afathi",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b2733b97dab73b877a71fcb0359b",
    previewUrl: "https://p.scdn.co/mp3-preview/2cbb3321c5d29deef8c47143c6e53696e2062932",
    spotifyUrl: "https://open.spotify.com/track/6LekvuF7dU7BZWJLqpLoS2"
  },
  {
    title: "Virtual Origami",
    artist: "Japanese Telecom",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273fcd5ccebb48683856aaa5c8b",
    previewUrl: "https://p.scdn.co/mp3-preview/f70d6b0121049cbfe04f0098af7b62db3c7ad633",
    spotifyUrl: "https://open.spotify.com/track/4m1AkuqvH4mIs9jfvtGisH"
  },
  {
    title: "Dangay Kotyo",
    artist: "Mamman Sani",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b2739a3ac8bb5fda504baa4c3914",
    previewUrl: "https://p.scdn.co/mp3-preview/89ecef4a193f6c70bfb722be39e83db829e58304",
    spotifyUrl: "https://open.spotify.com/track/4z1QuVmIXQviAfroX2p4Ye"
  },
  {
    title: "Écoute-moi camarade",
    artist: "Mazouni",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b2732aa507603f602ce47f545555",
    previewUrl: "https://p.scdn.co/mp3-preview/cb6ebddc4d0ecc3aa2a75cab27c207c37971f136",
    spotifyUrl: "https://open.spotify.com/track/4kckMTfGW38On1wcgSP11A"
  },
  {
    title: "I'll Be Good",
    artist: "Rene & Angela",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273800774df7bd240a3f0937092",
    previewUrl: "https://p.scdn.co/mp3-preview/1d283939a0455dd34f8087acd0023a62b22636da",
    spotifyUrl: "https://open.spotify.com/track/2SPNs07BKygbkbf48KNFEQ"
  },
  {
    title: "Mountain Time",
    artist: "Molly Nilsson",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273947b612d0e6889a040029feb",
    previewUrl: "https://p.scdn.co/mp3-preview/090506c1ff8e4d02029ed2b0cbd99e1250c26613",
    spotifyUrl: "https://open.spotify.com/track/6YmwZSqj8zbBabaTmYGLPu"
  },
  {
    title: "It Was A Good Day",
    artist: "Ice Cube",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273994c319841a923465d62e271",
    previewUrl: "https://p.scdn.co/mp3-preview/ea4eb0210dd50f7b3e1c43136adab0afc86e418f",
    spotifyUrl: "https://open.spotify.com/track/2qOm7ukLyHUXWyR4ZWLwxA"
  },
  {
    title: "Take Me To Beijing (一起回北京)",
    artist: "Chinese American Bear",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273e4a138c09307a4692bd38ee2",
    previewUrl: "https://p.scdn.co/mp3-preview/dc5fa69ff9ab736fc3762bfc068df6fada491ea4",
    spotifyUrl: "https://open.spotify.com/track/2vRjsevHyCwch58NZYHCR7"
  },
  {
    title: "Yawn",
    artist: "Bullion",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b2738d899255064890b8bfe8763c",
    previewUrl: "https://p.scdn.co/mp3-preview/d19a1b62ad9c0b95dba5ce8e65adf419b290ad4a",
    spotifyUrl: "https://open.spotify.com/track/2eLFER6tM2IjnWVJaB3V8C"
  },
  {
    title: "Wishy Washy",
    artist: "Coco & Clair Clair",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b27320dac1058d2fbc47ebeaceaf",
    previewUrl: "https://p.scdn.co/mp3-preview/3d37001d438a6a76afc792f232db882d8fe66255",
    spotifyUrl: "https://open.spotify.com/track/7CvYNbLwC3Zn96l2fbryv8"
  },
  {
    title: "Hot Sun (Demo)",
    artist: "Cleveland Francis",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b2732bd47f21d91171bced3f5583",
    previewUrl: "https://p.scdn.co/mp3-preview/6293b8d9a62ea9c5f40427047aab18fb0b88d69d",
    spotifyUrl: "https://open.spotify.com/track/4fietail9G4hkNU15kjDG9"
  },
  {
    "title": "The Heavenly Music Corporation IV",
    "artist": "Robert Fripp, Brian Eno",
    "coverUrl": "https://i.scdn.co/image/ab67616d0000b273ac934ad19223b329edc11fba",
    "previewUrl": "https://p.scdn.co/mp3-preview/433c7bbed796772a6891891bb670ebcf57ceff0c",
    "spotifyUrl": "https://open.spotify.com/track/4wqRKK4NoDtdXn7kD4H0k2"
  },
  {
    "title": "The Homeless Wanderer",
    "artist": "Emahoy Tsege Mariam Gebru",
    "coverUrl": "https://i.scdn.co/image/ab67616d0000b273d047aa54661bfc5ed8e4d216",
    "previewUrl": "https://p.scdn.co/mp3-preview/1434b77089e25f8dd6cafbb9821ef8d459a3d0f3",
    "spotifyUrl": "https://open.spotify.com/track/5P8UnnGI08TcPqxAD2T84C"
  },
  {
    "title": "Ternura",
    "artist": "Los Indios Tabajaras",
    "coverUrl": "https://i.scdn.co/image/ab67616d0000b27331b74a601a5a723002b2c57b",
    "previewUrl": "https://p.scdn.co/mp3-preview/3059457e416136bfb74b233c5037097825c0be8d",
    "spotifyUrl": "https://open.spotify.com/track/5J4g0vXPYsylkVWOcRjE7Q"
  },
  {
    "title": "Jesus Going to Clean House",
    "artist": "Lee Tracy, Isaac Manning",
    "coverUrl": "https://i.scdn.co/image/ab67616d0000b273db4a8eba2f6dddf79cb655dd",
    "previewUrl": "https://p.scdn.co/mp3-preview/71d05819ecac5b54d7d63e525420a9b8d7eaf26b",
    "spotifyUrl": "https://open.spotify.com/track/7ktUeo5nKHg9YNyxKInNc5"
  },
  {
    "title": "Empty Beach",
    "artist": "Coco",
    "coverUrl": "https://i.scdn.co/image/ab67616d0000b2737ef4d77e3ff43bd72639fcbb",
    "previewUrl": "https://p.scdn.co/mp3-preview/582e505c5f33296b9885bddd42298a6e4a34527a",
    "spotifyUrl": "https://open.spotify.com/track/7JEc8f5JbYdK5aourq93s5"
  },
  {
    "title": "Theory of Colours",
    "artist": "Dauwd",
    "coverUrl": "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b273199aa5ec1e066eeca88b5850",
    "previewUrl": "https://p.scdn.co/mp3-preview/e7cd0d360f89cb4160195fde5294bd1300057ec3",
    "spotifyUrl": "https://open.spotify.com/track/7nT24kprAb4l7tI5FSd9zU"
  },
  {
    "title": "Sunset People",
    "artist": "Donna Summer",
    "coverUrl": "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e020c3a44d76807bef665eacfa3",
    "previewUrl": "https://p.scdn.co/mp3-preview/228bd01708ac6d95e9da1dc8fca6f776e4776162",
    "spotifyUrl": "https://open.spotify.com/track/6O7QmxB7Euq2MnTdsPdMui"
  },
  {
    "title": "Dance II",
    "artist": "Discovery Zone",
    "coverUrl": "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e027507a5adb06f2936b86b0e20",
    "previewUrl": "https://p.scdn.co/mp3-preview/4400f6b013758518b27529b00945a0f8747aef3e",
    "spotifyUrl": "https://open.spotify.com/track/5iPyzbAvw84pJBJsFu05P4"
  },
  {
    "title": "I Cry (Night after Night)",
    "artist": "The Egyptian Lover",
    "coverUrl": "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e021ab9a50d2ccf0515190cd47b",
    "previewUrl": "https://p.scdn.co/mp3-preview/7841e01c0793d20d10e90a87dd5725e2041572ae",
    "spotifyUrl": "https://open.spotify.com/track/6W03BOggURVJECgPfpz7Gh"
  },
  {
    "title": "17 Days - Piano & A Microphone 1983 Version",
    "artist": "Prince",
    "coverUrl": "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02105086205323b81177c709d4",
    "previewUrl": "https://p.scdn.co/mp3-preview/616754212e2b0614f7579acc46efc86970dc5bb0",
    "spotifyUrl": "https://open.spotify.com/track/4n23NofxtEOwrkWmAUspOa"
  },
  {
    "title": "Hope",
    "artist": "Caleb Arredondo",
    "coverUrl": "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e025379f77309913e2e52410350",
    "previewUrl": "https://p.scdn.co/mp3-preview/0bb70a764065757799f640f52c7a09b2b2fc7cc8",
    "spotifyUrl": "https://open.spotify.com/track/5u83N41ielZUyeJzvIlBsg"
  }
];

const AudioCard = ({ item, index, onPlay, onStop }) => {
  return (
    <motion.div 
      className="audio-card cover-art-style"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => item.previewUrl && onPlay(item.previewUrl)}
      onMouseLeave={() => onStop()}
      onClick={() => window.open(item.spotifyUrl, '_blank')}
    >
      <div className="audio-cover-wrapper">
        <img src={item.coverUrl} alt={`${item.title} by ${item.artist}`} className="audio-cover-img" />
        <div className="audio-overlay">
          <div className="audio-info-mini">
            <span className="audio-title-mini">{item.title}</span>
            <span className="audio-artist-mini">{item.artist}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const lightFixturesData = [
  {
    title: "Flexible Lamp",
    description: "I set out to create a sculptural light that invites user interaction, allowing people to shape the piece themselves. The true design challenge lay in the engineering: ensuring perfectly even light dispersion throughout the fixture while preventing light bleed through the walls. Although the R&D process was extensive, it was incredibly rewarding to work with the new materials and 3D printing techniques along the way.",
    images: [
      "/light_projects/Flexible Lamp/unnamed.jpg",
      "/light_projects/Flexible Lamp/unnamed-1.png",
      "/light_projects/Flexible Lamp/unnamed.png"
    ]
  },
  {
    title: "Experiments in Gradient Diffraction",
    description: "A cool material to experiment with, especially when combined with high density LEDs and custom controllers.",
    images: [
      "/light_projects/experiments in gradient difraction/unnamed.jpg",
      "/light_projects/experiments in gradient difraction/unnamed-1.jpg",
      "/light_projects/experiments in gradient difraction/unnamed.png",
      "/light_projects/experiments in gradient difraction/unnamed-3.jpg"
    ],
    videos: [
      "WRlNiHCnGi0",
      "CUQnpYwlt1Y",
      "WuI_30nd0TU"
    ]
  },
  {
    title: "Fire Extinguisher Light",
    description: "A fully functional fire extinguisher light fixture. I worked with a specially painter down in LA after diving way too deep into the world of Lumilor. A conductive paint capable of producing light.",
    images: [
      "/light_projects/fire extinguisher light/unnamed.jpg",
      "/light_projects/fire extinguisher light/unnamed.png",
      "/light_projects/fire extinguisher light/fire_extinguisher_new.jpg"
    ],
    videos: [
      "gyBpyAyi3wc"
    ]
  },
  {
    title: "Ode to Dan Flavin",
    description: "I used these fabric screens to soften the setting sun’s warmth, blending it with the lights. As evening progresses, the colors become increasingly vivid, turning the windows into a public light art display. Dan Flavin was the first artist I came to love.",
    images: [
      "/light_projects/light instalation - ode to Dan Flavin/unnamed.jpg",
      "/light_projects/light instalation - ode to Dan Flavin/unnamed-1.jpg",
      "/light_projects/light instalation - ode to Dan Flavin/unnamed-2.jpg",
      "/light_projects/light instalation - ode to Dan Flavin/unnamed-3.jpg",
      "/light_projects/light instalation - ode to Dan Flavin/unnamed-4.jpg",
      "/light_projects/light instalation - ode to Dan Flavin/unnamed-5.jpg"
    ]
  },
  {
    title: "Ode to Robert Irwin",
    description: "A Robert Irwin-Inspired Light Wall Installation\n\nThis piece is intended to induce a state of wide-angle vision, where the viewer's focus shifts to the periphery, spreading perception outward. This way of seeing significantly expands our capacity to perceive and respond. By focusing on nothing, we see everything.",
    images: [
      "/light_projects/ode to robert irwin/unnamed.jpg",
      "/light_projects/ode to robert irwin/unnamed-1.jpg",
      "/light_projects/ode to robert irwin/unnamed-2.jpg"
    ]
  },
  {
    title: "Fluorescent Tube Guards",
    description: "I purchased many of these tubes when first starting out. Back then my goal was to copy Dan Flavin's work as closely as possible. That quickly transformed into creating new objects leveraging and inspired by the materials on hand. Many of these tube lights were inspired by residential tension pole lamps from the 60's.",
    images: [
      "/light_projects/fluorescent_tube_guards/tube_guard_2122.jpg",
      "/light_projects/fluorescent_tube_guards/tube_guard_2121.jpg",
      "/light_projects/fluorescent_tube_guards/tube_guard_2123.jpg",
      "/light_projects/fluorescent_tube_guards/tube_guard_2124.jpg",
      "/light_projects/fluorescent_tube_guards/tube_guard_2125.jpg",
      "/light_projects/fluorescent_tube_guards/tube_guard_2126.jpg"
    ]
  },
  {
    title: "T5 LED Lights",
    description: "The diffusion provided by these fixtures was really wonderful, and when paired with painstakingly cutting and laying gel filters over the LEDs, interesting combinations can be made. These fixtures unfortunately were unstable and I could not consistently get the gels to stay in place due to the heat generated by the LEDs.",
    images: [
      "/light_projects/t5_led_lights/t5_led_1.jpg",
      "/light_projects/t5_led_lights/t5_led_2.jpg",
      "/light_projects/t5_led_lights/t5_led_3.jpg",
      "/light_projects/t5_led_lights/t5_led_4.jpg",
      "/light_projects/t5_led_lights/t5_led_5.jpg",
      "/light_projects/t5_led_lights/t5_led_6.jpg",
      "/light_projects/t5_led_lights/t5_led_7.jpg",
      "/light_projects/t5_led_lights/t5_led_8.jpg"
    ]
  },
  {
    title: "Miscellaneous",
    description: "Fixtures and lighting for events that don't quite cleanly fit one category.",
    images: [
      "/light_projects/miscellaneous/misc_1.jpg",
      "/light_projects/miscellaneous/misc_2.jpg",
      "/light_projects/miscellaneous/misc_3.jpg",
      "/light_projects/miscellaneous/misc_4.jpg",
      "/light_projects/miscellaneous/misc_5.jpg",
      "/light_projects/miscellaneous/misc_6.jpg"
    ]
  }
];

const products = [
  { name: 'Obsidian', desc: 'A note-taking tool for networked thought.', link: 'https://obsidian.md/', iconUrl: '/product_icons/obsidian.jpg' },
  { name: 'Divisare', desc: 'A systemized view of architecture organized through images.', link: 'https://divisare.com', iconUrl: '/product_icons/divisare.png' },
  { name: 'Snipd', desc: 'A podcast player that uses AI to create transcripts for podcast episodes that you can follow along as you listen.', link: 'https://www.snipd.com/', iconUrl: '/product_icons/Snipd App Icon.jpg' },
  { name: 'b.bulb', desc: 'An incredible portable light fixture designed by Ingo Maurer.', link: 'https://www.ingo-maurer.com/en/products/bbulb/', iconUrl: '/product_icons/Bulb Ingo Maur Image.jpg' },
  { name: 'Notion', desc: 'We all know this one, I have been using Notion since its early days. By now I have 50 people accessing and using my "Botion".', link: 'https://www.notion.so/', iconUrl: '/product_icons/Notion Icon.jpg' },
  { name: 'Raindrop', desc: 'A bookmarking service that lets users save, organize, and share web content.', link: 'https://raindrop.io/', iconUrl: '/product_icons/raindrop.jpg' },
  { name: 'Contour Mouse', desc: 'Really feels like you are surfing the web.', link: 'https://www.contourdesign.com/collection/contour-rollermouse', iconUrl: '/product_icons/Coutour Mouse Roller Image.jpg' },
  { name: 'Readwise', desc: 'Helps you get the most out of what you read by making it easy to revisit your highlights from all your favorite reading platforms.', link: 'https://readwise.io/', iconUrl: '/product_icons/Readwise Icon.jpg' },
  { name: 'SFPL', desc: 'As an avid reader I enjoy accessing and supporting public services such as the San Francisco Public Library.', link: 'https://sfpl.org/', iconUrl: '/product_icons/SFPL Icon.jpg' },
  { name: '3M', desc: 'One of the best at iterative development, have yet to disappoint. You have certainly used some of their products.', link: 'https://www.3m.com/', iconUrl: '/product_icons/3m_v3.png' },
  { name: 'Tomito', desc: 'My favorite Pomodoro timer so far.', link: 'https://tomito.app/', iconUrl: '/product_icons/Tomito Icon App.jpg' },
  { name: 'Arc', desc: 'sad to see this one on its way out. Fingers crossed they keep it around & working.', link: 'https://arc.net', iconUrl: '/product_icons/Arc App Icon.jpg' },
  { name: 'Discover Quickly', desc: 'A powerful interface for music discovery, powered by Spotify.', link: 'https://discoverquickly.com/', iconUrl: '/product_icons/discover_quickly.png' },
  { name: 'Video Speed Controller', desc: 'Speed up, slow down, advance and rewind HTML5 audio/video with shortcuts.', link: 'https://chromewebstore.google.com/detail/video-speed-controller/nffaoalbilbmmfgbnbgppjihopabppdk', iconUrl: '/product_icons/video_speed_controller.png' },
  { name: 'eBay', desc: "The place I go to find stuff you can't get anywhere else on the Internet!", link: 'https://www.ebay.com', iconUrl: '/product_icons/ebay.png' },
  { name: 'Library of Babel', desc: 'A website that contains every possible combination of 1,312,000 characters.', link: 'https://libraryofbabel.info/', iconUrl: '/product_icons/library_of_babel.png' },
  { name: 'The True Size', desc: 'An interactive map that allows you to drag and drop countries to see their true size relative to others.', link: 'https://thetruesize.com', iconUrl: '/product_icons/the_true_size.png' },
  { name: 'On the Grid', desc: 'A curated neighborhood guide for creative people, by creative people.', link: 'https://onthegrid.city/', iconUrl: '/product_icons/on_the_grid.png' },
  { name: 'Internet Archive', desc: 'A non-profit library of millions of free books, movies, software, music, websites, and more.', link: 'https://archive.org/', iconUrl: '/product_icons/internet_archive.jpg' },
  { name: 'City-Data', desc: 'Profiles of all U.S. cities with stats on real estate, crime, schools, and more.', link: 'https://www.city-data.com/', iconUrl: '/product_icons/city_data_v2.png' },
  { name: 'Pilot Varsity Pen', desc: 'Cheap, vivid colors, and fun to write with.', link: 'https://www.dickblick.com/products/pilot-varsity-disposable-fountain-pens/', iconUrl: '/product_icons/varsity_pen.jpg' },
  { name: 'Kindle Oasis', desc: 'Hands down one of the best Kindle designs to date.', link: 'https://www.amazon.com/Kindle-Oasis-now-with-adjustable-warm-light/dp/B07F7TLZF4?th=1', iconUrl: '/product_icons/kindle_oasis.jpg' },
  { name: 'dbrand', desc: 'Coolest skins for all your electronics.', link: 'https://dbrand.com/', iconUrl: '/product_icons/dbrand.jpg' },
  { name: 'Project Gutenberg', desc: 'A library of over 70,000 free eBooks, primarily focusing on public domain works.', link: 'https://www.gutenberg.org/', iconUrl: '/product_icons/gutenberg_v2.png' },
  { 
    name: 'JODI', 
    desc: 'Two computer scientists working in San Jose State University in 1995 created the collective JODI. They are widely regarded as some of the first artists to seriously engage in the internet as both a medium and a site.', 
    longerDesc: 'It is described as an evolving personal index of whatever interests the artist. They refuse to establish an ideological hierarchy of its contents. Instead, it seems to illustrate their foundational principles. The endless blind clicking becomes both a meaning and an end, illustrating the logic of the code as a method of assemblage and the underlying structure of the transfer protocol.',
    link: 'https://wwwwwwwww.jodi.org/', 
    iconUrl: '/product_icons/jodi.png',
    expandable: true
  },
];

const projectsData = [
  {
    id: 'kindshare',
    title: 'KindShare',
    subtitle: 'Equitable Cost-Sharing App',
    description: 'Designed, developed, and launched an equitable cost-sharing app on iOS and Google Play. The platform supports users by providing the information and tools needed to navigate complex financial dynamics and facilitate fair cost-sharing.',
    icon: <Scale size={32} />,
    color: '#3b82f6',
    image: '/projects/kindshare_hero.png',
    links: [
      { label: 'iOS Store', url: 'https://apps.apple.com/us/app/kindshare-app/id6752961693' },
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.kindshare.app' }
    ]
  },
  {
    id: 'lightfixtures',
    title: 'Light Fixtures',
    subtitle: 'Hobby',
    description: "The art of light and space is my favorite medium. I spend much of my time experimenting and having fun building objects in our workshop.",
    icon: <Lightbulb size={32} />,
    color: '#eab308',
    image: '/downloaded_data/crafting/workshop.jpg',
    links: [],
    ctaLabel: 'Explore Fixtures'
  },
  {
    id: 'ambulancecost',
    title: 'AmbulanceCost.com',
    subtitle: 'Medical Billing Transparency',
    description: 'A site dedicated to making it easy for people to search and see the estimated cost of calling 911 and receiving care via an ambulance. Shedding light on the surprising bills that often come after emergency care—inspired by a close friend\'s experience with a multi-thousand dollar bill from an accident that was no fault of their own.',
    icon: <HeartPulse size={32} />,
    color: '#ef4444',
    image: '/projects/ambulance_hero.png',
    isAppIcon: true,
    noOverlay: true,
    links: [
      { label: 'Visit Site', url: 'https://ambulancecost.com' }
    ]
  },
  {
    id: 'time',
    title: 'Clock',
    subtitle: 'Time Orientation',
    description: 'This project reorients how we relate to future time. Instead of treating the future as a fixed series of points ahead of us, the clock reverses the frame of reference. Stable markers exist only in the past, while the present trails behind them...',
    longerDesc: [
      'This project reorients how we relate to future time. Instead of treating the future as a fixed series of points ahead of us, the clock reverses the frame of reference. Stable markers exist only in the past, while the present trails behind them.',
      'The hour and minute hands shift at irregular intervals. The minute hand can lag by up to roughly eight minutes before its reference point updates. The design reflects a simple premise: exact time is rarely necessary. In most situations, an approximate sense of time is enough.',
      'The clock’s visual elements also change throughout the day. The face, hands, and markers move through shifting color states tied to different periods of the day. The system reads the device’s date and time and adjusts for local sunset so these changes remain aligned with daylight conditions.'
    ],
    expandable: true,
    icon: <Clock size={32} />,
    color: '#14184a',
    image: null,
    iframe: '/projects/time_orientation.html',
    iframeDemo: '/projects/time_orientation_demo.html',
    links: []
  },
  {
    id: 'community',
    title: 'Community',
    subtitle: 'Co-Living in the Presidio',
    description: 'Over the past 9 years, I\'ve played a key role in building an emergent co-living community on Kobbe Avenue inside the Presidio of San Francisco. Four independently operating homes, all next door to one another, connected by a shared love of the National Park, each other, and a very active WhatsApp group.',
    icon: <Users size={32} />,
    color: '#6b7c5e',
    image: '/projects/community_hero.png',
    links: [
      { label: 'Visit Site', url: 'https://kobbeave.com' }
    ]
  },
  {
    id: 'fieldguide',
    title: 'Field Guide',
    subtitle: 'Digitizing SF History',
    description: 'After seeing the physical map made by the directors of The Last Black Man in San Francisco, I decided to digitize it. This Notion page is a collection of their favorite places and many of mine! Feel free to use it for your next walk through the city.',
    icon: <Map size={32} />,
    color: '#10b981',
    image: '/projects/fieldguide_hero.png',
    links: [
      { label: 'Check it out', url: 'https://bodenholland.notion.site/Boden-s-Guide-to-SF-16ba7aa277d980f7916bd7d7813e8d94?source=copy_link' }
    ]
  },
  {
    id: 'copythat',
    title: 'CopyThat',
    subtitle: 'Universal 2FA for macOS',
    description: 'A macOS application that allows you to automatically have two-factor authentication codes copy to your clipboard and automatically paste it into boxes. No longer does this feature have to be gated to Safari.',
    icon: <Smartphone size={32} />,
    color: '#2563eb',
    image: '/projects/copythat_hero.png',
    isAppIcon: true,
    noOverlay: true,
  },
  {
    id: 'yournyc',
    title: 'Your NYC',
    subtitle: 'Civic Project',
    description: 'An ongoing open-source civic initiative making city data accessible and interactive. What started as a project to turn New York City\'s published documents into a dedicated application has since expanded to include San Francisco, helping citizens easily browse, filter, and find what\'s relevant to their neighborhood.',
    icon: <FileText size={32} />,
    color: '#0ea5e9',
    image: '/projects/yournyc_hero.png',
    isWordmark: true,
    noOverlay: true,
    links: [
      { label: 'Visit YourNYC', url: 'https://www.yournyc.app' },
      { label: 'Visit YourSF', url: 'https://www.yoursf.us' }
    ]
  }
];

const photographyData = [
  ...[1,2,3,4,5,6,7,8].map(i => ({ src: `/photos/${i}.jpg`, alt: "" })),
  { src: "/photos/mountain.jpg", alt: "Mountain Sunrise" },
  ...[9,10,11,12,13,14,15].map(i => ({ src: `/photos/${i}.jpg`, alt: "" })),
  { src: "/photos/16_bad_design.jpg", alt: "Bad design" },
  { src: "/photos/18_robert_irwin.jpg", alt: "Marfa, Texas. Robert Irwin." },
  ...[1,2,3,4,5,6].map(i => ({ src: `/downloaded_data/nature/nature_${i}.jpg`, alt: "" }))
];

const sections = [
  { id: 'intro', label: 'Welcome' },
  { id: 'reading', label: 'Library' },
  { id: 'projects', label: 'Experiments' },
  { id: 'light-fixtures', label: 'Light Fixtures', hidden: true },
  { id: 'photography', label: 'Photography' },
  { id: 'contact', label: 'Reach Out' }
];

const retroGames = [
  { 
    id: 'minesweeper', 
    name: 'Minesweeper', 
    coverArtUrl: 'https://archive.org/services/img/win3_Mineswee', 
    archiveId: 'win3_Mineswee', 
    aspectRatio: '4/3', 
    controls: 'Mouse',
    instructions: "Minesweeper is a puzzle game where you uncover squares on a grid while avoiding hidden mines using numerical clues."
  },
  { 
    id: 'simcity', 
    name: 'SimCity Classic', 
    coverArtUrl: 'https://archive.org/services/img/msdos_SimCity_Classic_1994', 
    archiveId: 'msdos_SimCity_Classic_1994', 
    aspectRatio: '4/3', 
    controls: 'Mouse/Keys',
    instructions: "Design, build, and manage your own city while dealing with zoning, infrastructure, and unpredictable disasters."
  },
  { 
    id: 'amazon-trail', 
    name: 'Amazon Trail', 
    coverArtUrl: 'https://archive.org/services/img/msdos_Amazon_Trail_1993', 
    archiveId: 'msdos_Amazon_Trail_1993', 
    aspectRatio: '4/3', 
    controls: 'Mouse/Keys',
    instructions: "Embark on a historical journey through the Amazon rainforest, learning about its ecosystem and history while trying to survive."
  },
  { 
    id: 'number-munchers', 
    name: 'Number Munchers', 
    coverArtUrl: 'https://archive.org/services/img/msdos_Number_Munchers_1990', 
    archiveId: 'msdos_Number_Munchers_1990', 
    aspectRatio: '4/3', 
    controls: 'Arrows/Space',
    instructions: "Navigate your 'muncher' across a grid to eat numbers that match specific criteria while avoiding the dangerous Troggles."
  },
  { 
    id: 'skifree', 
    name: 'SkiFree', 
    coverArtUrl: 'https://archive.org/services/img/win3_SKIFREE', 
    archiveId: 'win3_SKIFREE', 
    aspectRatio: '4/3', 
    controls: 'Arrows',
    instructions: "Control a skier on a mountain slope, performing stunts and avoiding obstacles while trying to outrun the Abominable Snow Monster."
  },
  { 
    id: 'solitaire', 
    name: 'Solitaire', 
    coverArtUrl: 'https://archive.org/services/img/win3_SOLITARE', 
    archiveId: 'win3_SOLITARE', 
    aspectRatio: '4/3', 
    controls: 'Mouse',
    instructions: "Organize cards by suit and rank in this classic digital version of the popular card game also known as Klondike."
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('intro');
  const [libraryTab, setLibraryTab] = useState('audio'); // 'audio', 'screens', or 'pages'
  const [screensSubTab, setScreensSubTab] = useState('all'); // 'all', 'movie', 'show', 'game'
  const [openedBook, setOpenedBook] = useState(null);
  const [bookPageIndex, setBookPageIndex] = useState(0);
  const bookSfxRef = React.useRef({});
  React.useEffect(() => {
    const a = bookSfxRef.current;
    a.open = new Audio('/sounds/open-book.mp3');
    a.turn = new Audio('/sounds/turn-page.mp3');
    a.close = new Audio('/sounds/close-book.mp3');
    [a.open, a.turn, a.close].forEach(el => { el.preload = 'auto'; el.volume = 0.6; });
  }, []);
  const playBookSfx = (key) => {
    const el = bookSfxRef.current[key];
    if (!el) return;
    try { el.currentTime = 0; el.play().catch(() => {}); } catch {}
  };
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [showGame, setShowGame] = useState(false);
  const [currentGame, setCurrentGame] = useState(retroGames.find(g => g.id === 'simcity') || retroGames[0]);
  // All three pieces of state below need to be correct on the FIRST render
  // (not after a post-mount effect), otherwise mobile visitors see the
  // landing chooser flash for a frame before being routed to the modern
  // site. We compute the mobile check + localStorage choice synchronously
  // inside each useState initializer so the very first paint already
  // reflects the right mode.
  const detectIsMobile = () => {
    if (typeof window === 'undefined') return false;
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    return !!coarse && window.innerWidth < 768;
  };
  const readSavedMode = () => {
    if (typeof window === 'undefined') return null;
    try { return window.localStorage.getItem('site-mode'); } catch { return null; }
  };
  const [isRetroMode, setIsRetroMode] = useState(() => {
    // Mobile is forced to modern regardless of persisted choice.
    if (detectIsMobile()) return false;
    return readSavedMode() === 'retro';
  });
  // Landing / mode chooser. First-time visitors see a fullscreen chooser
  // ("Modern site" vs "Enter the 90s"). The choice is persisted in
  // localStorage so returning visitors skip the landing. `landingLeaving`
  // tracks which mode is being entered so we can play a brief overlay
  // transition (fade for modern, flash for retro) before swapping the
  // body content underneath.
  const [siteModeChosen, setSiteModeChosen] = useState(() => {
    // Mobile skips the chooser entirely — initialize to true so the
    // landing JSX never renders even for one frame on phones.
    if (detectIsMobile()) return true;
    const saved = readSavedMode();
    return saved === 'modern' || saved === 'retro';
  });
  const [landingLeaving, setLandingLeaving] = useState(null);
  // Mobile = touch-primary device with a small viewport. The 90s desktop UI
  // (draggable windows, Start menu, BIOS boot) is unusable on phones, so we
  // force the modern site and hide the retro entry points entirely.
  const [isMobile, setIsMobile] = useState(detectIsMobile);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => {
      const coarse = window.matchMedia?.('(pointer: coarse)').matches;
      setIsMobile(!!coarse && window.innerWidth < 768);
    };
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  // Top-level white cover that hides the modern→CRT swap and the brief
  // teal flash through the DOS-screen flicker. Mounted at full opacity so
  // the user only ever sees a clean white → DOS-boot fade.
  const [retroCover, setRetroCover] = useState(false);
  // CRT "screen turning on" beat. `crtScreenAwake=false` shows a gray off-
  // state panel with the usual CRT glass texture (shadow/smudge/vignette/
  // scanlines) on top — this is what the user sees right after the cover
  // lifts. `crtScreenPoweringOn` triggers the flash+line animation. Once
  // the animation finishes we set `crtScreenAwake=true`, which unmounts
  // the off-state and mounts the DOS boot screen underneath.
  // On page reload while retro is persisted, the Shift+P boot sequence
  // never runs — there's no on-mount trigger for it. Without this seed,
  // `crtScreenAwake` would stay `false` and the taskbar gate (which AND's
  // on `crtScreenAwake`) would never open, leaving the user staring at a
  // desktop with no Start button. Skip the BIOS theatre on reload and land
  // straight on the awake desktop. The flag is reset to false inside the
  // Shift+P handler whenever the user explicitly re-enters retro.
  const [crtScreenAwake, setCrtScreenAwake] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (detectIsMobile()) return false;
    return readSavedMode() === 'retro';
  });
  const [crtScreenPoweringOn, setCrtScreenPoweringOn] = useState(false);
  const [isBootingUp, setIsBootingUp] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [bootLines, setBootLines] = useState([]);
  const [shutdownLines, setShutdownLines] = useState([]);
  const [isPoweringOff, setIsPoweringOff] = useState(false);
  const [isWindowsLoading, setIsWindowsLoading] = useState(false);
  const [isCursorBusy, setIsCursorBusy] = useState(false);
  const [isShutdownConfirmOpen, setIsShutdownConfirmOpen] = useState(false);
  const [isShutdownHelpOpen, setIsShutdownHelpOpen] = useState(false);
  const [shutdownChoice, setShutdownChoice] = useState('shutdown');
  // README window — explains the system + game controls.
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);
  // Recycle Bin window + its full-size image viewer.
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [isRecycleImgOpen, setIsRecycleImgOpen] = useState(false);

  // Period-style browser app. iframe points at theoldnet.com (a curated
  // 90s archive that allows CORS + iframe embedding — protoweb.org itself
  // sends X-Frame-Options: SAMEORIGIN and can't be embedded directly).
  // browserHistory + browserHistoryIdx implement a manual back/forward
  // stack — we can't read iframe history cross-origin, so the stack
  // tracks every explicit URL the user submits via the address bar.
  const BROWSER_HOME = 'https://theoldnet.com/';
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [browserMinimized, setBrowserMinimized] = useState(false);
  const [browserMaximized, setBrowserMaximized] = useState(false);
  const [browserUrl, setBrowserUrl] = useState(BROWSER_HOME);
  const [browserAddressInput, setBrowserAddressInput] = useState(BROWSER_HOME);
  const [browserHistory, setBrowserHistory] = useState([BROWSER_HOME]);
  const [browserHistoryIdx, setBrowserHistoryIdx] = useState(0);
  const [browserReloadKey, setBrowserReloadKey] = useState(0);
  const [browserPos, setBrowserPos] = useState({ top: 50, left: 60 });
  const [browserSize, setBrowserSize] = useState({ width: 820, height: 580 });

  // Webamp (Music) — desktop app. Assets (tracks + skins) are loaded on
  // first open; the Webamp lib + butterchurn presets lazy-import inside
  // the wrapper component.
  const [isWebampOpen, setIsWebampOpen] = useState(false);
  const [webampAssets, setWebampAssets] = useState(null);
  const openWebamp = async () => {
    if (!webampAssets) {
      const [tracksRes, skinsRes] = await Promise.all([
        fetch('/wmp/audio/tracks.json').catch(() => null),
        fetch('/wmp/skins/skins.json').catch(() => null),
      ]);
      const localTracks = tracksRes && tracksRes.ok ? (await tracksRes.json()).tracks || [] : [];
      const skinsManifest = skinsRes && skinsRes.ok ? await skinsRes.json() : { initial: null, available: [] };
      const spotifyTracks = audioData
        .filter((t) => t.previewUrl)
        .map((t) => ({
          url: t.previewUrl,
          metaData: { artist: t.artist || '', title: t.title || '', album: '' },
        }));
      setWebampAssets({
        tracks: localTracks.length ? localTracks : spotifyTracks,
        skins: skinsManifest.available || [],
        initialSkin: skinsManifest.initial ? { url: skinsManifest.initial } : undefined,
      });
    }
    setIsWebampOpen(true);
  };

  // Desktop icon positions (draggable). Each entry: { x, y } in px from
  // the top-left of the .crt-win95-desktop. Defaults are seeded as a
  // single column at boot, then re-laid-out the first time retro mode
  // becomes active (once the desktop has real dimensions to measure
  // against). After that, user drags are preserved.
  const ICON_LIST = React.useMemo(() => ([
    { id: 'showcase' },
    { id: 'readme' },
    { id: 'recyclebin' },
    { id: 'music' },
    { id: 'browser' },
    ...retroGames.map((g) => ({ id: g.id })),
  ]), []);
  const [iconPositions, setIconPositions] = useState(() => {
    const pos = {};
    ICON_LIST.forEach((icon, i) => {
      pos[icon.id] = { x: 8, y: 8 + i * 84 };
    });
    return pos;
  });
  const crtDesktopRef = React.useRef(null);

  // Lay out icons relative to the desktop's current width/height. The
  // previous version ran once and froze the positions, so resizing the
  // browser stranded the right-column icons off-screen or left huge
  // empty space. A ResizeObserver re-computes positions every time the
  // .crt-win95-desktop element changes size — initial mount, window
  // resize, or the min-width kick-in below. Layout:
  //   - Recycle Bin / Music / README: top-right column
  //   - Games: top-left column, stacked
  //   - Portfolio: bottom-left
  React.useEffect(() => {
    if (!isRetroMode) return;
    const el = crtDesktopRef.current;
    if (!el) return;
    const computeLayout = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 200 || rect.height < 200) return;
      const W = rect.width;
      const H = rect.height;
      const ICON_W = 64;
      const ROW_H = 84;
      const M = 12;
      const next = {};
      next.recyclebin = { x: W - ICON_W - M, y: M };
      next.music      = { x: W - ICON_W - M, y: M + ROW_H };
      next.readme     = { x: W - ICON_W - M, y: M + 2 * ROW_H };
      next.browser    = { x: W - ICON_W - M, y: M + 3 * ROW_H };
      retroGames.forEach((g, i) => {
        next[g.id] = { x: M, y: M + i * ROW_H };
      });
      // Portfolio sits at the bottom of the left column, directly under
      // the last game icon — feels more natural than floating at the
      // bottom-left corner of the desktop. Clamped to (H - ROW_H - M)
      // as a safety: with the CRT's min size in place the natural
      // position fits, but the clamp ensures Portfolio never drops off
      // the bottom of the desktop during transient mounts or any
      // edge case where the desktop is briefly shorter than expected.
      next.showcase = {
        x: M,
        y: Math.min(M + retroGames.length * ROW_H, H - ROW_H - M),
      };
      setIconPositions(next);
    };
    computeLayout();
    const ro = new ResizeObserver(computeLayout);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isRetroMode]);

  // Drag-or-click handler factory. Distinguishes a click (no movement
  // past a 4px threshold) from a drag. Calls openHandler on click,
  // updates iconPositions on drag.
  const startIconDragOrClick = React.useCallback((id, openHandler) => (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const origPos = iconPositions[id] || { x: 0, y: 0 };
    let moved = false;
    const move = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      if (moved) {
        setIconPositions((prev) => ({
          ...prev,
          [id]: {
            x: Math.max(0, origPos.x + dx),
            y: Math.max(0, origPos.y + dy),
          },
        }));
      }
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      if (!moved) openHandler && openHandler();
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }, [iconPositions]);
  // Showcase window — Henry-style portfolio explorer inside the CRT.
  // Full window-manager state: position, size, minimized, maximized, z-index.
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [showcaseTab, setShowcaseTab] = useState('home');
  const [showcaseMinimized, setShowcaseMinimized] = useState(false);
  const [showcaseMaximized, setShowcaseMaximized] = useState(false);
  // Win95 picture viewer for the Photography tab (null = no photo open).
  const [showcasePhotoIndex, setShowcasePhotoIndex] = useState(null);
  // Library sub-tab inside the showcase.
  const [showcaseLibTab, setShowcaseLibTab] = useState('audio');
  // Heads-up notice on the Audio tab — warns visitors that hovering an
  // album triggers a 30s Spotify preview. Dismissed for the session once
  // clicked.
  const [audioPreviewNoticeOk, setAudioPreviewNoticeOk] = useState(false);
  // Section-scoped mute for the hover audio previews in the Library →
  // Audio tab. Independent of the CRT's system mute (isCrtMuted) and
  // master volume — toggling this does NOT silence ambient, clicks, the
  // Webamp player, or any other audio on the desktop. When true,
  // playAudioPreview short-circuits before creating the <Audio> node.
  // Default: muted, so first-time visitors don't get surprise audio on
  // hover before they've found the toggle.
  const [audioPreviewMuted, setAudioPreviewMuted] = useState(true);
  // Screens (movies/shows/games) detail viewer — index in screensData or null.
  const [showcaseScreenIndex, setShowcaseScreenIndex] = useState(null);
  // Products detail viewer — index in products or null.
  const [showcaseProductIndex, setShowcaseProductIndex] = useState(null);
  // Books accordion — index in booksData currently expanded, or null.
  const [showcaseBookIndex, setShowcaseBookIndex] = useState(null);
  // Experiments detail viewer — index in projectsData or null.
  const [showcaseExperimentIndex, setShowcaseExperimentIndex] = useState(null);
  // Whether the Light Fixtures sub-gallery is expanded inside that detail.
  const [showcaseFixturesOpen, setShowcaseFixturesOpen] = useState(false);
  // When set, shows a larger picture viewer for a fixture image: { src, alt }.
  const [showcaseFixtureImage, setShowcaseFixtureImage] = useState(null);
  // Screens sub-filter — mirrors the modern site's screensSubTab values.
  const [showcaseScreensFilter, setShowcaseScreensFilter] = useState('all');
  // Filter helper, identical to the matching the modern site uses.
  const matchesScreensFilter = (item) => {
    const s = (item.subtitle || '').toLowerCase();
    switch (showcaseScreensFilter) {
      case 'movies': return s.includes('movie');
      case 'shows':  return s.includes('tv series') || s.includes('show');
      case 'games':  return s.includes('game');
      default:       return true;
    }
  };
  // 30-second hover preview for audio tracks (Spotify previewUrl).
  const showcasePreviewRef = React.useRef(null);
  const playAudioPreview = (url) => {
    if (!url) return;
    // Section-scoped mute — skip creating the <Audio> node entirely so
    // nothing leaks even if the global mute changes later.
    if (audioPreviewMuted) return;
    if (showcasePreviewRef.current) {
      showcasePreviewRef.current.pause();
    }
    const a = new Audio(url);
    a.volume = isCrtMuted ? 0 : 0.45 * (volumeStep / 6);
    a.play().catch(() => {});
    showcasePreviewRef.current = a;
  };
  const stopAudioPreview = () => {
    if (showcasePreviewRef.current) {
      showcasePreviewRef.current.pause();
      showcasePreviewRef.current = null;
    }
  };
  const [showcasePos, setShowcasePos] = useState({ top: 40, left: 40 });
  const [showcaseSize, setShowcaseSize] = useState({ width: 760, height: 520 });
  const showcaseDragRef = React.useRef(null);

  // Fresh-open defaults for the Portfolio window — sized as ~85% of the CRT
  // desktop so the About-page portrait (Figure 2) has room to breathe.
  // Clamped to sensible min/max and never overflows the desktop.
  const computeShowcaseDefaults = React.useCallback(() => {
    const el = crtDesktopRef.current;
    if (!el) return { size: { width: 760, height: 520 }, pos: { top: 40, left: 40 } };
    const { width: dw, height: dh } = el.getBoundingClientRect();
    const targetW = Math.round(dw * 0.85);
    const targetH = Math.round(dh * 0.85);
    const width = Math.min(1100, Math.min(Math.max(720, targetW), Math.max(420, dw - 16)));
    const height = Math.min(720, Math.min(Math.max(500, targetH), Math.max(280, dh - 16)));
    const left = Math.max(8, Math.round((dw - width) / 2));
    const top = Math.max(8, Math.round((dh - height) / 2 - 12));
    return { size: { width, height }, pos: { top, left } };
  }, []);

  // Shared resize-handle factory. Wires a mousedown on a corner grip to a
  // window-level mousemove that adjusts width/height via the given setter.
  const makeResizeHandler = (size, setSize, min = { width: 360, height: 260 }) =>
    React.useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const origW = size.width;
      const origH = size.height;
      const move = (ev) => {
        setSize({
          width: Math.max(min.width, origW + (ev.clientX - startX)),
          height: Math.max(min.height, origH + (ev.clientY - startY)),
        });
      };
      const up = () => {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', up);
      };
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
    }, [size.width, size.height, setSize, min.width, min.height]);
  const onShowcaseResizeMouseDown = makeResizeHandler(showcaseSize, setShowcaseSize);

  // README window — same chrome as Showcase: draggable, min/max/close.
  const [readmePos, setReadmePos] = useState({ top: 60, left: 120 });
  const [readmeSize, setReadmeSize] = useState({ width: 640, height: 540 });
  const onReadmeResizeMouseDown = makeResizeHandler(readmeSize, setReadmeSize);
  const [readmeMinimized, setReadmeMinimized] = useState(false);
  const [readmeMaximized, setReadmeMaximized] = useState(false);
  const readmeDragRef = React.useRef(null);
  const onReadmeTitleMouseDown = React.useCallback((e) => {
    if (readmeMaximized) return;
    if (e.target.closest('.crt-win-btn')) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const origTop = readmePos.top;
    const origLeft = readmePos.left;
    readmeDragRef.current = { startX, startY, origTop, origLeft };
    const move = (ev) => {
      const d = readmeDragRef.current;
      if (!d) return;
      setReadmePos({
        top: Math.max(0, d.origTop + (ev.clientY - d.startY)),
        left: Math.max(-200, d.origLeft + (ev.clientX - d.startX)),
      });
    };
    const up = () => {
      readmeDragRef.current = null;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    e.preventDefault();
  }, [readmePos.top, readmePos.left, readmeMaximized]);
  const toggleReadmeMin = () => setReadmeMinimized((m) => !m);
  const toggleReadmeMax = () => setReadmeMaximized((m) => !m);
  const closeReadme = () => {
    setIsReadmeOpen(false);
    setReadmeMinimized(false);
    setReadmeMaximized(false);
  };
  const openReadme = () => {
    setIsReadmeOpen(true);
    setReadmeMinimized(false);
  };

  const onShowcaseTitleMouseDown = React.useCallback((e) => {
    if (showcaseMaximized) return;
    // Ignore clicks on the window control buttons (min/max/close).
    if (e.target.closest('.crt-win-btn')) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const origTop = showcasePos.top;
    const origLeft = showcasePos.left;
    showcaseDragRef.current = { startX, startY, origTop, origLeft };
    const move = (ev) => {
      const d = showcaseDragRef.current;
      if (!d) return;
      setShowcasePos({
        top: Math.max(0, d.origTop + (ev.clientY - d.startY)),
        left: Math.max(-200, d.origLeft + (ev.clientX - d.startX)),
      });
    };
    const up = () => {
      showcaseDragRef.current = null;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    e.preventDefault();
  }, [showcasePos.top, showcasePos.left, showcaseMaximized]);

  const openShowcase = (tab = 'about') => {
    const { size, pos } = computeShowcaseDefaults();
    setShowcaseSize(size);
    setShowcasePos(pos);
    setShowcaseTab(tab);
    setIsShowcaseOpen(true);
    setShowcaseMinimized(false);
  };
  const toggleShowcaseMin = () => setShowcaseMinimized((m) => !m);
  const toggleShowcaseMax = () => setShowcaseMaximized((m) => !m);

  // Browser navigation helpers. We maintain a manual history stack since
  // we can't read the iframe's own history cross-origin.
  const normalizeBrowserInput = (raw) => {
    const v = (raw || '').trim();
    if (!v) return BROWSER_HOME;
    if (/^https?:\/\//i.test(v)) return v;
    // Bare-domain or path — assume https. Period browsers would have
    // assumed http://, but our embed has to use https to avoid mixed
    // content blocks from the parent page.
    if (/^[a-z0-9-]+\.[a-z]/i.test(v)) return 'https://' + v;
    // Anything else: treat as a search via theoldnet's archive.
    return BROWSER_HOME;
  };
  const browserNavigate = (raw) => {
    const next = normalizeBrowserInput(raw);
    setBrowserUrl(next);
    setBrowserAddressInput(next);
    setBrowserHistory((h) => {
      const trimmed = h.slice(0, browserHistoryIdx + 1);
      const last = trimmed[trimmed.length - 1];
      if (last === next) return trimmed;
      const out = [...trimmed, next];
      setBrowserHistoryIdx(out.length - 1);
      return out;
    });
  };
  const browserBack = () => {
    if (browserHistoryIdx <= 0) return;
    const i = browserHistoryIdx - 1;
    setBrowserHistoryIdx(i);
    setBrowserUrl(browserHistory[i]);
    setBrowserAddressInput(browserHistory[i]);
  };
  const browserForward = () => {
    if (browserHistoryIdx >= browserHistory.length - 1) return;
    const i = browserHistoryIdx + 1;
    setBrowserHistoryIdx(i);
    setBrowserUrl(browserHistory[i]);
    setBrowserAddressInput(browserHistory[i]);
  };
  const browserRefresh = () => setBrowserReloadKey((k) => k + 1);
  const browserGoHome = () => browserNavigate(BROWSER_HOME);
  const toggleBrowserMin = () => setBrowserMinimized((m) => !m);
  const toggleBrowserMax = () => setBrowserMaximized((m) => !m);
  const closeBrowser = () => {
    setIsBrowserOpen(false);
    setBrowserMinimized(false);
    setBrowserMaximized(false);
  };
  const closeShowcase = () => {
    setIsShowcaseOpen(false);
    setShowcaseMinimized(false);
    setShowcaseMaximized(false);
    setShowcasePhotoIndex(null);
    setShowcaseScreenIndex(null);
    setShowcaseProductIndex(null);
    setShowcaseBookIndex(null);
    setShowcaseExperimentIndex(null);
    setShowcaseFixturesOpen(false);
    setShowcaseFixtureImage(null);
    stopAudioPreview();
  };

  // Fixture image picture-viewer keyboard handler.
  React.useEffect(() => {
    if (!showcaseFixtureImage) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setShowcaseFixtureImage(null);
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [showcaseFixtureImage]);

  // Helpers to walk through only the filtered screens set.
  const filteredScreenIndices = () =>
    screensData.reduce((acc, item, i) => (matchesScreensFilter(item) ? acc.concat(i) : acc), []);
  const stepScreenIndex = (delta) => {
    const indices = filteredScreenIndices();
    if (indices.length === 0) return showcaseScreenIndex;
    const pos = indices.indexOf(showcaseScreenIndex);
    if (pos === -1) return indices[0];
    return indices[(pos + delta + indices.length) % indices.length];
  };

  // Screens detail: arrow-key navigation + Escape to close.
  React.useEffect(() => {
    if (showcaseScreenIndex === null) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setShowcaseScreenIndex(null);
      } else if (e.key === 'ArrowRight') {
        setShowcaseScreenIndex(stepScreenIndex(1));
      } else if (e.key === 'ArrowLeft') {
        setShowcaseScreenIndex(stepScreenIndex(-1));
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showcaseScreenIndex, showcaseScreensFilter]);

  // Products detail: same keyboard pattern.
  React.useEffect(() => {
    if (showcaseProductIndex === null) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setShowcaseProductIndex(null);
      } else if (e.key === 'ArrowRight') {
        setShowcaseProductIndex((i) => (i + 1) % products.length);
      } else if (e.key === 'ArrowLeft') {
        setShowcaseProductIndex(
          (i) => (i - 1 + products.length) % products.length
        );
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [showcaseProductIndex]);

  // Experiments detail: arrow-key nav + Escape to close.
  React.useEffect(() => {
    if (showcaseExperimentIndex === null) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setShowcaseExperimentIndex(null);
        setShowcaseFixturesOpen(false);
      } else if (e.key === 'ArrowRight') {
        setShowcaseExperimentIndex((i) => (i + 1) % projectsData.length);
        setShowcaseFixturesOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setShowcaseExperimentIndex(
          (i) => (i - 1 + projectsData.length) % projectsData.length
        );
        setShowcaseFixturesOpen(false);
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [showcaseExperimentIndex]);

  // Picture viewer: arrow-key nav + Escape to close.
  React.useEffect(() => {
    if (showcasePhotoIndex === null) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setShowcasePhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        setShowcasePhotoIndex((i) => (i + 1) % photographyData.length);
      } else if (e.key === 'ArrowLeft') {
        setShowcasePhotoIndex(
          (i) => (i - 1 + photographyData.length) % photographyData.length
        );
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [showcasePhotoIndex]);
  // CRT picture controls — 0..6 steps. 3 = neutral (1.0x).
  const [brightnessStep, setBrightnessStep] = useState(3);
  const [contrastStep, setContrastStep] = useState(3);
  // Volume knob — 0..6, step 6 = full, step 0 = silent. Default at MAX so
  // every click / keyboard / ambient / boot sound plays at its original
  // level (same as before the knob was added). Turn the knob down from
  // the bezel to reduce. The startup video has its own quieter baseline
  // applied on top of this.
  const [volumeStep, setVolumeStep] = useState(6);
  const [isCrtMuted, setIsCrtMuted] = useState(false);

  // Landing mode chooser — on mount, honor any persisted choice from a
  // previous visit. 'retro' goes straight to the desktop without replaying
  // the boot sequence (the user already saw it the first time). 'modern'
  // just shows the existing modern site.
  React.useEffect(() => {
    // On mobile, skip the landing entirely and force the modern site —
    // even if a previous desktop visit persisted 'retro' to localStorage.
    if (isMobile) {
      setSiteModeChosen(true);
      setIsRetroMode(false);
      return;
    }
    try {
      const saved = window.localStorage.getItem('site-mode');
      if (saved === 'modern') {
        setSiteModeChosen(true);
      } else if (saved === 'retro') {
        setSiteModeChosen(true);
        setIsRetroMode(true);
      }
    } catch { /* localStorage disabled — fall through to landing */ }
  }, [isMobile]);

  const handleLandingSelect = (mode) => {
    if (landingLeaving) return;
    setLandingLeaving(mode);
    try { window.localStorage.setItem('site-mode', mode); } catch { /* ignore */ }
    const delay = mode === 'retro' ? 700 : 500;
    setTimeout(() => {
      if (mode === 'retro') {
        // Raise the white cover BEFORE the swap so the landing→CRT
        // transition (and the DOS-screen flicker over the teal background)
        // happen entirely behind a clean white screen. The Shift+P handler
        // will schedule the fade-out once the boot screen is stable.
        setRetroCover(true);
      }
      setSiteModeChosen(true);
      setLandingLeaving(null);
      if (mode === 'retro') {
        // Reuse the existing Shift+P handler so the user sees the full
        // BIOS → Windows startup video → desktop sequence on first entry.
        shiftPHandlerRef.current({ shiftKey: true, key: 'P', repeat: false });
      }
    }, delay);
  };

  // Push volume + mute into the audio module whenever they change.
  React.useEffect(() => {
    setMasterVolume(volumeStep / 6);
  }, [volumeStep]);
  React.useEffect(() => {
    setAudioMuted(isCrtMuted);
  }, [isCrtMuted]);

  // Defensive: whenever we leave retro mode (by ANY path — shutdown,
  // power button, Shift+P toggle, etc.), force every CRT audio source
  // off so nothing leaks into the modern site.
  React.useEffect(() => {
    if (!isRetroMode) {
      try { stopAmbient({ fade: 0 }); } catch {}
      try { stopAudioPreview(); } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRetroMode]);
  // Ref mirror of isRetroMode so deferred callbacks scheduled during a
  // retro session (notably the startup-video safety timeout) can check
  // the current mode without recreating the callback on every toggle.
  // Without this, exiting retro before the ~12s safety net fires leaks
  // the ambient CRT loop into the modern site.
  const isRetroModeRef = React.useRef(isRetroMode);
  React.useEffect(() => { isRetroModeRef.current = isRetroMode; }, [isRetroMode]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [timePhase, setTimePhase] = useState(() => getPhaseFromHour(new Date().getHours()));
  const cyclePhase = () => setTimePhase(p => PHASE_ORDER[(PHASE_ORDER.indexOf(p) + 1) % PHASE_ORDER.length]);

  React.useEffect(() => {
    let interval;
    const fetchLocationAndPhase = async () => {
      try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (res.ok) {
          const data = await res.json();
          if (data && data.latitude && data.longitude) {
            const phase = getPhaseFromSuncalc(parseFloat(data.latitude), parseFloat(data.longitude));
            setTimePhase(phase);
          }
        }
      } catch (e) {
        console.error('Failed to fetch location for time phase', e);
      }
    };
    
    fetchLocationAndPhase();
    
    // Update every 15 mins to catch phase changes while tab is open
    interval = setInterval(() => {
      fetchLocationAndPhase();
    }, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Apply the phase class before first paint so the landing chooser
  // doesn't flash white before the time-of-day palette kicks in.
  React.useLayoutEffect(() => {
    const el = document.documentElement;
    PHASE_ORDER.forEach(p => el.classList.remove(`phase-${p}`));
    el.classList.add(`phase-${timePhase}`);
  }, [timePhase]);
  const [statusMessage, setStatusMessage] = useState('Ready');
  const [showStartModal, setShowStartModal] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);

  const tabsRef = React.useRef(null);
  const audioRef = React.useRef(null);

  // DOS-style BIOS boot script — each entry is [delayMs, text].
  // Total wall-clock duration is tuned to match the power-on audio (~5.04s).
  const BOOT_SCRIPT = React.useMemo(() => ([
    [80,  'BOTEK BIOS v2.04 (C) 1996, BOTEK Industries'],
    [280, 'CPU: BOTEK 486DX2-66  RAM: 640K Conventional, 7424K Extended'],
    [80,  ''],
    [420, 'Performing POST...'],
    [260, '  Memory test:  640K OK'],
    [220, '  Extended memory test:  7424K OK'],
    [300, '  Detecting IDE drives... HDD-0: BOTEK-540MB'],
    [240, '  CD-ROM: BOTEK CDR-204 .................... OK'],
    [200, '  Mouse: PS/2 Compatible .................. OK'],
    [200, '  Keyboard: 102-key US ..................... OK'],
    [80,  ''],
    [520, 'Starting BOTEK DOS...'],
    [360, 'HIMEM    is testing extended memory.........done.'],
    [340, 'Loading CONFIG.SYS...........................OK'],
    [340, 'Loading AUTOEXEC.BAT.........................OK'],
    [80,  ''],
    [320, 'C:\\>'],
  ]), []);

  const SHUTDOWN_SCRIPT = React.useMemo(() => ([
    [80,  'C:\\>shutdown /now'],
    [380, ''],
    [80,  'Closing applications...'],
    [260, 'Saving session state................. OK'],
    [260, 'Flushing disk cache.................. OK'],
    [240, 'Unmounting drives.................... OK'],
    [260, 'Stopping system services............. OK'],
    [260, 'Halting CPU.......................... OK'],
    [120, ''],
    [240, 'It is now safe to turn off your computer.'],
  ]), []);

  // Ref to the keyboard handler so non-keyboard entry points (e.g. the
  // "Enter 90s mode" button, the landing chooser) can invoke the same
  // boot pipeline directly without synthesizing a DOM keyboard event.
  // Synthetic KeyboardEvents reach the listener, but dispatching from a
  // click bound to a tab-specific subtree was unreliable.
  const shiftPHandlerRef = React.useRef(() => {});

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Retro Mode with Shift + P. Side effects live OUTSIDE the
      // setState updater to avoid double-firing under React.StrictMode.
      if (e.shiftKey && e.key.toLowerCase() === 'p') {
        const next = !isRetroMode;
        setIsRetroMode(next);
        // Mark the landing as already chosen so it doesn't reappear, and
        // keep localStorage in sync so refreshes honor the latest mode.
        setSiteModeChosen(true);
        try { window.localStorage.setItem('site-mode', next ? 'retro' : 'modern'); } catch { /* ignore */ }
        if (next) {
          // The CRT lives inside the `intro` switch case. If retro is
          // entered from another tab (About, Products, etc.), force the
          // active tab back to intro so the CRT actually mounts — without
          // this, .retro-active styling strips the sidebar/padding but the
          // user stays on their original page with PC sounds in the void.
          setActiveTab('intro');
          // Cover the screen in white during the modern→CRT swap and the
          // DOS-screen flicker so neither the swap nor the CRT's teal
          // background ever flashes through. Idempotent when the cover is
          // already up (engaged by handleLandingSelect on first entry).
          setRetroCover(true);
          // Boot chain: DOS BIOS → Windows startup video → desktop with busy cursor.
          // The video carries its own audio (no separate playPowerOn).
          setBootLines([]);
          setIsBootingUp(true);
          setIsWindowsLoading(false);
          setIsCursorBusy(false);
          setIsShuttingDown(false);
          setShowGame(false);
          setIsWebampOpen(false);
          setIsStartMenuOpen(false);
          // Reset the screen-on beat for this boot. The off-panel covers
          // DOS until the power-on animation completes.
          setCrtScreenAwake(false);
          setCrtScreenPoweringOn(false);
          // Cover sits at opacity 1 for ~300ms (long enough to hide the
          // mount-time flicker on the off-panel) then fades out. After
          // the cover lifts, the user sees the PC's gray off-screen with
          // the glass texture (shadow, smudge, vignette, scanlines) on top.
          setTimeout(() => setRetroCover(false), 300);
          // Beat 1: see the PC (gray off-screen) — cover fully gone ~+700ms.
          // Beat 2: power-button click + screen warms up over 1.6s. The
          //         first BIOS line is preloaded into bootLines so it
          //         fades in along with the phosphor instead of typing
          //         onto a blank black screen.
          // Beat 3: warming ends ~+2600ms, screen fully on, first line
          //         is solid.
          // Beat 4: line 2 (CPU/RAM) starts typing ~+2880ms — ~280ms
          //         "settled" beat after the screen is fully on.
          let powerOnNode = null;
          setTimeout(() => {
            if (!isRetroModeRef.current) return;
            try { powerOnNode = playPowerOn(); } catch {}
            setCrtScreenPoweringOn(true);
            // Pre-load the first line so it appears bloom-in with the
            // phosphor warm-up instead of materializing later.
            setBootLines([BOOT_SCRIPT[0][1]]);
          }, 1000);
          // Animation duration must match the .crt-dos-warming keyframes.
          setTimeout(() => {
            if (!isRetroModeRef.current) return;
            setCrtScreenPoweringOn(false);
            setCrtScreenAwake(true);
          }, 2600);

          // Boot line cadence — multiplier slows BIOS line-to-line gaps so
          // the boot feels period-correct (chunkier) rather than rushed.
          // The first line is already on screen (faded in with the
          // phosphor), so we start scheduling from BOOT_SCRIPT[1] onwards.
          const BOOT_SCALE = 1.35;
          let acc = 2880;
          BOOT_SCRIPT.forEach(([delay, text], i) => {
            if (i === 0) return;          // pre-loaded during warm-up
            if (i > 1) acc += delay * BOOT_SCALE;  // line 1 lands at +2880
            setTimeout(() => setBootLines(prev => [...prev, text]), acc);
          });

          // After all BIOS lines (acc ≈ 4320ms), pause briefly, then show the
          // Windows startup video. The video advances to the desktop on its
          // own via `handleStartupVideoEnded` (onEnded). A safety timeout
          // covers the case where the video errors out and never fires `ended`.
          const dosEnd = acc + 450;
          setTimeout(() => {
            setIsBootingUp(false);
            setIsWindowsLoading(true);
            // Cut the boot sfx so the video's audio doesn't overlap with it.
            if (powerOnNode) {
              try {
                // Tiny fade-out over ~180ms then pause.
                const start = powerOnNode.volume;
                const steps = 8;
                let i = 0;
                const id = setInterval(() => {
                  i += 1;
                  powerOnNode.volume = Math.max(0, start * (1 - i / steps));
                  if (i >= steps) {
                    clearInterval(id);
                    powerOnNode.pause();
                  }
                }, 22);
              } catch {}
            }
          }, dosEnd);
          setTimeout(() => {
            // Safety net: ~6.6s video + 1s buffer
            handleStartupVideoEnded();
          }, dosEnd + 7600);
        } else {
          setIsBootingUp(false);
          setIsWindowsLoading(false);
          setIsCursorBusy(false);
          setIsStartMenuOpen(false);
          try { stopAmbient({ fade: 250 }); } catch {}
        }
      }

      // Escape inside the OS — closes the topmost transient UI but
      // NEVER exits retro mode. The only ways to power off are the
      // monitor's power button or Start → Shut Down…
      if (e.key === 'Escape' && isRetroMode) {
        if (isShutdownHelpOpen)    { setIsShutdownHelpOpen(false); return; }
        if (isShutdownConfirmOpen) { setIsShutdownConfirmOpen(false); return; }
        if (isStartMenuOpen)       { setIsStartMenuOpen(false); return; }
        if (isRecycleImgOpen)      { setIsRecycleImgOpen(false); return; }
        if (isRecycleBinOpen)      { setIsRecycleBinOpen(false); return; }
        if (isReadmeOpen)          { setIsReadmeOpen(false); return; }
        if (showGame) {
          // Release the archive.org game iframe focus and close the window.
          try {
            const ifr = document.querySelector('.crt-game-iframe');
            if (ifr) ifr.blur();
            if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
              document.activeElement.blur();
            }
            window.focus();
          } catch {}
          setShowGame(false);
          setIsWebampOpen(false);
          return;
        }
      }

      // Play a key click while the CRT is open.
      if (isRetroMode && !isBootingUp && e.key !== 'Escape' && !e.repeat) {
        try { playKeyboard(); } catch {}
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    // Expose the handler so the "Enter 90s mode" click + landing chooser
    // can invoke the exact same boot pipeline without dispatching DOM events.
    shiftPHandlerRef.current = handleKeyDown;
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      shiftPHandlerRef.current = () => {};
    };
  }, [isRetroMode, isBootingUp]);

  // Click sounds inside the CRT screen.
  const handleCrtMouseDown = () => {
    if (!isRetroMode || isBootingUp) return;
    try { playMouseDown(); } catch {}
  };
  const handleCrtMouseUp = () => {
    if (!isRetroMode || isBootingUp) return;
    try { playMouseUp(); } catch {}
  };

  // Best-effort click sound for the browser iframe. Cross-origin iframes
  // (theoldnet.com) DON'T propagate their internal mousedown events to
  // the parent — that's a hard browser security boundary, no workaround.
  // We CAN observe when the user clicks INTO the iframe though: focus
  // moves out of our window, firing `blur`, and `document.activeElement`
  // becomes the iframe. So we play the click sound on entry. Subsequent
  // clicks while already inside the iframe will stay silent.
  React.useEffect(() => {
    if (!isRetroMode || !isBrowserOpen || browserMinimized) return;
    const onBlur = () => {
      // Defer one tick so document.activeElement reflects the new focus.
      setTimeout(() => {
        const ifr = document.querySelector('.crt-browser-iframe');
        if (document.activeElement === ifr) {
          try { playMouseDown(); } catch {}
          setTimeout(() => { try { playMouseUp(); } catch {} }, 70);
        }
      }, 0);
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [isRetroMode, isBrowserOpen, browserMinimized]);

  // Called when the Windows startup video finishes (or errors). Reveals the
  // desktop with a brief busy/progress cursor before settling to normal.
  // Boden's preference: open My Showcase by default after boot.
  const handleStartupVideoEnded = React.useCallback(() => {
    // The boot sequence schedules a safety setTimeout that calls this
    // ~12s in, in case the video never fires `ended`. If the user has
    // already exited retro mode by then (shutdown, power button, Shift+P),
    // that timer still fires — and without this guard would start the
    // ambient CRT loop on the modern site. Bail unconditionally.
    if (!isRetroModeRef.current) return;
    setIsWindowsLoading(false);
    setIsCursorBusy(true);
    try { startAmbient(0.3); } catch {}
    // Auto-open the Showcase window on its home view.
    const { size: scSize, pos: scPos } = computeShowcaseDefaults();
    setShowcaseSize(scSize);
    setShowcasePos(scPos);
    setShowcaseTab('home');
    setShowcaseMinimized(false);
    setShowcaseMaximized(false);
    setIsShowcaseOpen(true);
    setTimeout(() => setIsCursorBusy(false), 2400);
  }, [computeShowcaseDefaults]);

  const handleShutdown = () => {
    setIsStartMenuOpen(false);
    setShutdownLines([]);
    setIsShuttingDown(true);
    try { stopAmbient({ fade: 600 }); } catch {}
    try { playShutdown(); } catch {}
    let acc = 0;
    SHUTDOWN_SCRIPT.forEach(([delay, text]) => {
      acc += delay;
      setTimeout(() => setShutdownLines(prev => [...prev, text]), acc);
    });
    // Hold the shutdown screen until the 4.51s shutdown audio finishes.
    // Script lines total ~2180ms; +2400ms buffer lands ~4580ms.
    setTimeout(() => {
      setIsRetroMode(false);
      setIsShuttingDown(false);
      setShowGame(false);
      setIsWebampOpen(false);
      try { window.localStorage.setItem('site-mode', 'modern'); } catch { /* ignore */ }
    }, acc + 2400);
  };

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
      if (!selectedPhoto) return;

      const currentIndex = photographyData.findIndex(p => p.src === selectedPhoto.src);
      if (currentIndex === -1) return;

      if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % photographyData.length;
        setSelectedPhoto(photographyData[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + photographyData.length) % photographyData.length;
        setSelectedPhoto(photographyData[prevIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  const [submitted, setSubmitted] = useState(false);

  const navigate = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  // Auto-scroll active library tab into view (centered) on mobile
  React.useEffect(() => {
    if (activeTab === 'reading' && tabsRef.current) {
      const activeBtn = tabsRef.current.querySelector('.library-tab-btn.active');
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [libraryTab, activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("access_key", "ebb06987-43d1-46d1-a2d0-2716e2c860b9");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      }).then((res) => res.json());

      if (res.success) {
        setSubmitted(true);
        e.target.reset();
      } else {
        alert("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong, please try again.");
    }
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'intro':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.1 }
              }
            }}
            className="section-content"
          >
            {!isRetroMode ? (
              <div className="intro-text">
                <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>Hi, I’m Boden 👋</motion.p>
                <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>Welcome to my personal website.</motion.p>
                <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                  This is where I share the books, music, film, and creative experiments that occupy my time outside of product management. It’s a glimpse into the things I’m building and exploring just for the fun of it.
                </motion.p>
                <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                  If you’re looking for the professional side of things, feel free to head over to my <a href="https://www.linkedin.com/in/boden-holland/" target="_blank" rel="noopener noreferrer" className="linkedin-link">LinkedIn</a>. You can also visit <a href="https://www.openform.company" target="_blank" rel="noopener noreferrer" className="open-form-link">Open Form</a>, my independent product studio, to see the products I’ve been building.
                </motion.p>
                <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>I hope you find something you enjoy here, and please don’t hesitate to reach out!</motion.p>
              </div>
             ) : (
              <motion.div
                className="crt-computer-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 22, stiffness: 120 }}
              >
                {/* CRT Monitor Body */}
                <div className="crt-body">
                  {/* Top ridge/vent */}
                  <div className="crt-top-vent">
                    <span className="crt-vent-slot" /><span className="crt-vent-slot" /><span className="crt-vent-slot" />
                  </div>
                  {/* Main bezel + screen */}
                  <div className="crt-bezel">
                    <div className="crt-inner-bezel">
                      <div
                        className={`crt-screen${isCursorBusy ? ' crt-cursor-busy' : ''}${isWindowsLoading ? ' crt-cursor-wait' : ''}`}
                        onMouseDown={handleCrtMouseDown}
                        onMouseUp={handleCrtMouseUp}
                        style={{
                          // CRT picture controls — period dials map to CSS filter.
                          // step 3 = neutral (1.0×). 0..6 spans 0.6×..1.4×.
                          filter: `brightness(${(0.6 + brightnessStep * (0.8 / 6)).toFixed(3)}) contrast(${(0.6 + contrastStep * (0.8 / 6)).toFixed(3)})`,
                        }}
                      >
                        {/* Scanlines + vignette overlays */}
                        <div className="crt-scanlines" />
                        <div className="crt-vignette" />
                        {/* Glass overlays — smudge + inner shadow */}
                        <div className="crt-shadow-overlay" />
                        <div className="crt-smudge-overlay" />
                        {/* CRT off-state: gray panel sits below the glass-
                            texture overlays (shadow/smudge/vignette/scanlines)
                            so the "powered off" screen still carries the CRT
                            grime. Stays mounted through the warming phase so
                            the grime + gray are visible *under* the DOS layer
                            as DOS fades in; unmounts once crtScreenAwake. */}
                        {isBootingUp && !crtScreenAwake && (
                          <div className="crt-screen-off" />
                        )}
                        {/* DOS-style boot-up screen — always mounted during
                            boot. Opacity is gated by class so the screen
                            "warms up" (fade-in) from the off-panel beneath,
                            instead of a hard cut. */}
                        {isBootingUp && (
                          <div className={`crt-dos-screen${
                            crtScreenPoweringOn ? ' crt-dos-screen-warming'
                            : !crtScreenAwake ? ' crt-dos-screen-hidden'
                            : ''
                          }`}>
                            {bootLines.map((line, i) => (
                              <div key={i} className="crt-dos-line">
                                {line || ' '}
                              </div>
                            ))}
                            <span className="crt-dos-cursor" />
                          </div>
                        )}
                        {/* DOS-style shutdown screen */}
                        {isShuttingDown && (
                          <div className="crt-dos-screen">
                            {shutdownLines.map((line, i) => (
                              <div key={i} className="crt-dos-line">
                                {line || ' '}
                              </div>
                            ))}
                            <span className="crt-dos-cursor" />
                          </div>
                        )}
                        {/* CRT power-off animation: white flash → collapse to line → dot → black */}
                        {isPoweringOff && (
                          <div className="crt-poweroff">
                            <div className="crt-poweroff-flash" />
                            <div className="crt-poweroff-line" />
                          </div>
                        )}
                        {/* Startup video between DOS boot and the desktop.
                            Its own audio plays; advances to desktop on `ended`. */}
                        {isWindowsLoading && (
                          <div className="crt-winsplash">
                            <video
                              className="crt-winsplash-video"
                              src="/crt/video/startup.mp4"
                              autoPlay
                              playsInline
                              preload="auto"
                              // Tame the startup chime — full volume is too
                              // startling on first load. Baseline ~0.35 then
                              // multiplied by the user's master volume / mute.
                              onLoadedMetadata={(e) => {
                                const base = 0.35;
                                e.currentTarget.volume = isCrtMuted ? 0 : base * (volumeStep / 6);
                              }}
                              onEnded={handleStartupVideoEnded}
                              onError={handleStartupVideoEnded}
                            />
                          </div>
                        )}
                        {/* Win95 desktop */}
                        <div className="crt-win95-desktop" ref={crtDesktopRef}>
                          {/* Desktop icons — absolutely positioned, draggable.
                              Click without movement = open; drag = move. */}
                          {!showGame && (() => {
                            const renderIcon = (id, label, src, onOpen, imgClass = '') => {
                              const pos = iconPositions[id] || { x: 0, y: 0 };
                              return (
                                <div
                                  key={id}
                                  className="crt-desk-icon"
                                  style={{ position: 'absolute', left: pos.x, top: pos.y }}
                                  onMouseDown={startIconDragOrClick(id, onOpen)}
                                >
                                  <div className={`crt-desk-icon-img${imgClass ? ` ${imgClass}` : ''}`}>
                                    <img src={src} alt={label} />
                                  </div>
                                  <span>{label}</span>
                                </div>
                              );
                            };
                            return (
                              <>
                                {renderIcon('showcase',   'Portfolio',     '/crt/icons/portfolio.png', () => openShowcase('home'), 'crt-desk-icon-portfolio')}
                                {renderIcon('readme',     'README.txt',    '/crt/icons/readme.svg',   openReadme)}
                                {renderIcon('recyclebin', 'Recycle Bin',   '/crt/icons/recyclebin.png', () => setIsRecycleBinOpen(true), 'crt-desk-icon-recyclebin')}
                                {renderIcon('music',      'Music',         '/wmp/icons/music-deck.png', openWebamp, 'crt-desk-icon-music')}
                                {renderIcon('browser',    'Internet',      '/crt/icons/browser.png',  () => { setIsBrowserOpen(true); setBrowserMinimized(false); }, 'crt-desk-icon-browser')}
                                {retroGames.map((game) =>
                                  renderIcon(game.id, game.name, game.coverArtUrl, () => {
                                    setCurrentGame(game);
                                    setShowGame(true);
                                  })
                                )}
                              </>
                            );
                          })()}
                          {/* App Window */}
                          {showGame && (
                            <div className={`crt-app-window ${currentGame.aspectRatio === '3/4' ? 'win-vertical' : ''}`}>
                              <div className="crt-win-titlebar">
                                <span>🖥 {currentGame.name}</span>
                                <div className="crt-win-btns">
                                  <div className="crt-win-btn">_</div>
                                  <div className="crt-win-btn">□</div>
                                  <div className="crt-win-btn crt-win-close" onClick={() => setShowGame(false)}>×</div>
                                </div>
                              </div>
                              <div className="crt-win-body">
                                <iframe
                                  className="crt-game-iframe"
                                  /* --gw / --gh feed the CSS transform that scales the
                                     iframe up to fill the window body. Defaults match the
                                     most common DOS native (640×480 VGA); override per
                                     game if its emulator renders at a different
                                     resolution (e.g. 320×200). */
                                  style={{
                                    '--gw': currentGame.nativeWidth || 640,
                                    '--gh': currentGame.nativeHeight || 480,
                                  }}
                                  src={`https://archive.org/embed/${currentGame.archiveId}?autoplay=1`}
                                  allowFullScreen
                                />
                              </div>
                              {currentGame.controls && (
                                <div className="crt-win-statusbar">
                                  <div className="win95-status-inset">Controls: {currentGame.controls}</div>
                                  <div className="win95-status-inset">{statusMessage}</div>
                                </div>
                              )}
                            </div>
                          )}
                          {/* Webamp (Music) mount — its own chrome handles dragging.
                              Lazy-loaded the first time the user opens it.
                              ErrorBoundary prevents a Webamp crash from
                              unmounting the entire React tree (which would
                              show the white body background under #root). */}
                          {isWebampOpen && (
                            <WebampErrorBoundary onError={() => setIsWebampOpen(false)}>
                              <Suspense fallback={null}>
                                <Webamp
                                  tracks={webampAssets?.tracks || []}
                                  skins={webampAssets?.skins || []}
                                  initialSkin={webampAssets?.initialSkin}
                                  onClose={() => setIsWebampOpen(false)}
                                />
                              </Suspense>
                            </WebampErrorBoundary>
                          )}

                          {/* Internet Explorer-style browser app. Iframes
                              theoldnet.com (a curated 90s web archive that
                              permits embedding) and adds period-correct
                              chrome: back / forward / refresh / home + a
                              working address bar. Back/forward use a manual
                              history stack because the iframe is cross-
                              origin and its real history isn't readable. */}
                          {isBrowserOpen && !browserMinimized && (
                            <div
                              className={`crt-app-window crt-browser-window${browserMaximized ? ' is-maximized' : ''}`}
                              style={browserMaximized ? undefined : {
                                top: browserPos.top,
                                left: browserPos.left,
                                width: browserSize.width,
                                height: browserSize.height,
                                bottom: 'auto',
                                right: 'auto',
                              }}
                            >
                              <div className="crt-win-titlebar crt-browser-titlebar">
                                <span><img src="/crt/icons/browser.png" alt="" />The Internet</span>
                                <div className="crt-win-btns">
                                  <div className="crt-win-btn" onClick={toggleBrowserMin}>_</div>
                                  <div className="crt-win-btn" onClick={toggleBrowserMax}>□</div>
                                  <div className="crt-win-btn crt-win-close" onClick={closeBrowser}>×</div>
                                </div>
                              </div>
                              <div className="crt-browser-toolbar">
                                <button
                                  type="button"
                                  className="crt-browser-tool-btn"
                                  onClick={browserBack}
                                  disabled={browserHistoryIdx <= 0}
                                  title="Back"
                                >◀ Back</button>
                                <button
                                  type="button"
                                  className="crt-browser-tool-btn"
                                  onClick={browserForward}
                                  disabled={browserHistoryIdx >= browserHistory.length - 1}
                                  title="Forward"
                                >Forward ▶</button>
                                <button
                                  type="button"
                                  className="crt-browser-tool-btn"
                                  onClick={browserRefresh}
                                  title="Reload"
                                >⟳ Refresh</button>
                                <button
                                  type="button"
                                  className="crt-browser-tool-btn"
                                  onClick={browserGoHome}
                                  title="Home"
                                >⌂ Home</button>
                              </div>
                              <form
                                className="crt-browser-address"
                                onSubmit={(e) => { e.preventDefault(); browserNavigate(browserAddressInput); }}
                              >
                                <label className="crt-browser-address-label">Address</label>
                                <input
                                  type="text"
                                  className="crt-browser-address-input"
                                  value={browserAddressInput}
                                  onChange={(e) => setBrowserAddressInput(e.target.value)}
                                  spellCheck="false"
                                  autoComplete="off"
                                />
                                <button type="submit" className="crt-browser-go">Go</button>
                              </form>
                              <div className="crt-browser-body">
                                <iframe
                                  key={browserReloadKey}
                                  className="crt-browser-iframe"
                                  src={browserUrl}
                                  title="The Old Net"
                                />
                              </div>
                              <div className="crt-browser-statusbar">
                                <span>theoldnet.com — period archive</span>
                              </div>
                            </div>
                          )}
                          {/* Showcase window — Henry-style portfolio explorer.
                              Draggable, minimizable, maximizable. */}
                          {isShowcaseOpen && (
                            <div
                              className={`showcase-window${showcaseMaximized ? ' is-maximized' : ''}${showcaseMinimized ? ' is-minimized' : ''}`}
                              style={showcaseMaximized || showcaseMinimized ? undefined : {
                                top: showcasePos.top,
                                left: showcasePos.left,
                                width: showcaseSize.width,
                                height: showcaseSize.height,
                              }}
                            >
                              <div
                                className="showcase-titlebar"
                                onMouseDown={onShowcaseTitleMouseDown}
                                onDoubleClick={toggleShowcaseMax}
                              >
                                <span className="showcase-titlebar-text">
                                  <img className="showcase-titlebar-icon" src="/crt/icons/portfolio.png" alt="" />
                                  Boden Holland — Portfolio 2026
                                </span>
                                <div className="crt-win-btns">
                                  <div className="crt-win-btn" onClick={toggleShowcaseMin}>_</div>
                                  <div className="crt-win-btn" onClick={toggleShowcaseMax}>□</div>
                                  <div className="crt-win-btn crt-win-close" onClick={closeShowcase}>×</div>
                                </div>
                              </div>
                              <div className={`showcase-body${showcaseTab === 'home' ? ' showcase-body-home' : ' showcase-body-section'}`}>
                                {showcaseTab === 'home' ? (
                                  // Home view — centered name + subtitle + horizontal nav
                                  <div className="showcase-header">
                                    <h1
                                      className="showcase-name"
                                      onClick={() => setShowcaseTab('home')}
                                      title="Home"
                                    >Boden Holland</h1>
                                    <p className="showcase-sub">Product Manager</p>
                                    <div className="showcase-nav">
                                      {[
                                        ['about',       'ABOUT'],
                                        ['library',     'LIBRARY'],
                                        ['projects',    'EXPERIMENTS'],
                                        ['photography', 'PHOTOGRAPHY'],
                                        ['contact',     'CONTACT'],
                                      ].map(([key, label]) => (
                                        <button
                                          key={key}
                                          className="showcase-nav-link"
                                          onClick={() => setShowcaseTab(key)}
                                        >
                                          {label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  // Section view — left sidebar nav + right content
                                  <aside className="showcase-sidebar">
                                    <h1
                                      className="showcase-sidebar-name"
                                      onClick={() => setShowcaseTab('home')}
                                      title="Return home"
                                    >Boden<br />Holland</h1>
                                    <p className="showcase-sidebar-sub">Portfolio 2026</p>
                                    <nav className="showcase-sidebar-nav">
                                      {[
                                        ['home',        'HOME'],
                                        ['about',       'ABOUT'],
                                        ['library',     'LIBRARY'],
                                        ['projects',    'EXPERIMENTS'],
                                        ['photography', 'PHOTOGRAPHY'],
                                        ['contact',     'CONTACT'],
                                      ].map(([key, label]) => {
                                        const isActive = showcaseTab === key;
                                        return (
                                          <button
                                            key={key}
                                            className={`showcase-sidebar-link${isActive ? ' active' : ''}`}
                                            onClick={() => setShowcaseTab(key)}
                                          >
                                            <span className="showcase-sidebar-bullet" aria-hidden="true">
                                              {isActive ? '○' : ''}
                                            </span>
                                            <span>{label}</span>
                                          </button>
                                        );
                                      })}
                                    </nav>
                                  </aside>
                                )}

                                {showcaseTab !== 'home' && (
                                  <div className="showcase-content">
                                    {showcaseTab === 'about' && (
                                      <article className="showcase-section showcase-about">
                                        {/* Big display "Welcome" headline + smaller name line. */}
                                        <h2 className="about-welcome">Welcome</h2>
                                        <h3 className="about-title">I'm Boden,</h3>

                                        <p>
                                          a product builder based in San Francisco. I'm interested
                                          in civic tools, housing, public data, and the systems
                                          that shape everyday life.
                                        </p>
                                        <p>
                                          This site is where I collect the things I'm building and
                                          exploring. Some are practical tools. Some are experiments.
                                          Most are attempts to make confusing systems easier to
                                          understand.
                                        </p>

                                        {/* LinkedIn CTA — Henry-style bordered block with the
                                            globe icon to the left, big bold question stacked
                                            above the link. */}
                                        <div className="about-cta-block">
                                          <img
                                            className="about-cta-icon"
                                            src="/about/internet.webp"
                                            alt=""
                                            aria-hidden="true"
                                          />
                                          <div className="about-cta-text">
                                            <p className="about-cta-heading">Looking for my professional background?</p>
                                            <a
                                              className="about-cta-link"
                                              href="https://www.linkedin.com/in/boden-holland/"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >Visit my LinkedIn.</a>
                                          </div>
                                        </div>

                                        <br /><br />
                                        <h3>About Me</h3>

                                        <p>
                                          I'm interested in problems that are useful but often
                                          overlooked. I like working on products that help people
                                          make sense of systems that are more confusing than they
                                          need to be.
                                        </p>
                                        <p>
                                          Much of my work has been in housing, civic infrastructure,
                                          data, and complex workflows. I've worked on products for
                                          virtual worlds, custom homebuilding, experimentation, and
                                          AI assisted product development.
                                        </p>
                                        <p>
                                          Lately, I've been building my own projects through{' '}
                                          <a
                                            href="https://www.openform.company"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >Open Form</a>, an independent product studio for small
                                          tools with public value.
                                        </p>

                                        {/* Figure 1 — full-width hero between About Me and
                                            Recent Work. Not floated; sits in the flow as a
                                            section divider. */}
                                        <figure className="about-figure-full">
                                          <img src="/about/young.jpg" alt="A young Boden in a cowboy hat at the family computer" />
                                          <figcaption><b>Figure 1:</b> Me at the family PC, c. 1998</figcaption>
                                        </figure>

                                        <br />
                                        <h3>Recent Work</h3>

                                        <p>
                                          Lately, I've been building projects around the systems
                                          people have to navigate in everyday life, including
                                          money, healthcare, housing, neighborhoods, and public
                                          information.
                                        </p>
                                        <p>
                                          <a
                                            href="https://www.kindshare.app"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          ><b>kindshare</b></a> is an expense splitting app designed
                                          to make shared finances feel more fair and easier to
                                          talk about.
                                        </p>
                                        <p>
                                          <a
                                            href="https://www.ambulancecost.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          ><b>AmbulanceCost</b></a> helps people estimate ambulance
                                          charges by ZIP code using public rate data where
                                          available.
                                        </p>
                                        <p>
                                          <a
                                            href="https://www.yoursf.us"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          ><b>YourSF</b></a> and{' '}
                                          <a
                                            href="https://www.yournyc.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          ><b>YourNYC</b></a> are ongoing open source
                                          civic projects focused on making city data more
                                          accessible, interactive, and useful to regular people.
                                        </p>
                                        <p>
                                          <a
                                            href="https://www.localtake.app"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          ><b>Local Take</b></a> is an early stage project that
                                          builds in depth city profiles from civic data, then
                                          helps people moving to a new city understand which
                                          neighborhoods might fit their life.
                                        </p>
                                        <p>
                                          There are more projects in progress, but the focus is
                                          mostly the same: making confusing systems easier to
                                          understand and act on.
                                        </p>

                                        <br /><br />
                                        {/* Outside of Work — entire text block (heading + prose)
                                            sits in a flex pair, vertically centered against the
                                            portrait so the header isn't orphaned above. */}
                                        <div className="about-outside-pair">
                                          <div className="about-outside-text">
                                            <h3>Outside of Work</h3>
                                            <p>
                                              Outside of product, I spend time with books, music,
                                              film, design experiments, family history, and odd
                                              little internet projects. I'm interested in cities,
                                              public systems, and visual culture.
                                            </p>
                                            <p>This site is a place for that work and curiosity.</p>
                                          </div>
                                          <div className="about-outside-figure">
                                            <div className="captioned-image about-figure about-figure-pro about-figure-inline">
                                              <img src="/about/professional.jpg" alt="Boden Holland — portrait" />
                                              <p><sub><b>Figure 2:</b> Me, today</sub></p>
                                            </div>
                                          </div>
                                        </div>

                                        <br /><br />
                                        <p className="about-signoff">
                                          Thanks for reading. If something here catches your
                                          attention, feel free to{' '}
                                          <a
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); setShowcaseTab('contact'); }}
                                          >reach out</a>.
                                        </p>
                                      </article>
                                    )}

                                    {showcaseTab === 'contact' && (
                                      <div className="showcase-section">
                                        <h2 className="showcase-section-heading">Contact</h2>
                                        {submitted ? (
                                          <div className="showcase-contact-success">
                                            <div className="showcase-contact-success-icon">
                                              <img src="/crt/icons/about.png" alt="" />
                                            </div>
                                            <div>
                                              <p style={{ fontWeight: 'bold', marginBottom: 6 }}>Message sent.</p>
                                              <p>Thanks for reaching out — I'll get back to you soon.</p>
                                              <button
                                                type="button"
                                                className="win95-button"
                                                style={{ marginTop: 14 }}
                                                onClick={() => setSubmitted(false)}
                                              >Send another</button>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            <p className="showcase-contact-intro">
                                              I'm always open to new projects, collaborations, or just a friendly chat.
                                              Drop me a message below and I'll get back to you as soon as I can.
                                            </p>
                                            <form className="showcase-contact-form" onSubmit={handleSubmit}>
                                              <div className="showcase-field">
                                                <label htmlFor="sc-name">Name:</label>
                                                <input
                                                  type="text"
                                                  id="sc-name"
                                                  name="name"
                                                  required
                                                  placeholder="Your name"
                                                />
                                              </div>
                                              <div className="showcase-field">
                                                <label htmlFor="sc-email">E-mail:</label>
                                                <input
                                                  type="email"
                                                  id="sc-email"
                                                  name="email"
                                                  required
                                                  placeholder="your@email.com"
                                                />
                                              </div>
                                              <div className="showcase-field showcase-field-message">
                                                <label htmlFor="sc-message">Message:</label>
                                                <textarea
                                                  id="sc-message"
                                                  name="message"
                                                  rows="7"
                                                  required
                                                  placeholder="What's on your mind?"
                                                />
                                              </div>
                                              <div className="showcase-form-actions">
                                                <button type="submit" className="win95-button win95-button-primary">
                                                  Send Message
                                                </button>
                                                <button
                                                  type="reset"
                                                  className="win95-button"
                                                  onClick={() => {/* native reset handles it */}}
                                                >
                                                  Clear
                                                </button>
                                              </div>
                                            </form>
                                          </>
                                        )}
                                      </div>
                                    )}

                                    {showcaseTab === 'photography' && (
                                      <div className="showcase-section showcase-photography">
                                        <h2 className="showcase-section-heading">Photography</h2>
                                        <p className="showcase-photo-intro">
                                          My first real hobby was photography.
                                        </p>
                                        <blockquote className="showcase-photo-quote">
                                          "The camera is an instrument that teaches people how to see without a camera."
                                          <span className="showcase-photo-cite">— Dorothea Lange</span>
                                        </blockquote>
                                        <div className="showcase-photo-grid">
                                          {photographyData.map((photo, i) => (
                                            <button
                                              type="button"
                                              key={i}
                                              className="showcase-photo-thumb"
                                              onClick={() => setShowcasePhotoIndex(i)}
                                              title={photo.alt || `Photo ${i + 1}`}
                                            >
                                              <img
                                                src={photo.src}
                                                alt={photo.alt || ''}
                                                loading="lazy"
                                              />
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {showcaseTab === 'library' && (
                                      <div className="showcase-section showcase-library">
                                        <h2 className="showcase-section-heading">Library</h2>
                                        <div className="showcase-lib-tabs">
                                          {[
                                            ['audio',    'Audio'],
                                            ['screens',  'Screens'],
                                            ['pages',    'Pages'],
                                            ['products', 'Products'],
                                          ].map(([key, label]) => (
                                            <button
                                              key={key}
                                              type="button"
                                              className={`showcase-lib-tab${showcaseLibTab === key ? ' active' : ''}`}
                                              onClick={() => { stopAudioPreview(); setShowcaseLibTab(key); }}
                                            >{label}</button>
                                          ))}
                                        </div>
                                        <div className="showcase-lib-body">
                                          {showcaseLibTab === 'audio' && (
                                            <>
                                              {/* Section-scoped mute toggle.
                                                  Stays visible whether or not the warning above is
                                                  dismissed; flipping it ONLY affects this section's
                                                  hover previews — system mute, ambient, clicks, and
                                                  the Webamp player are untouched. */}
                                              <button
                                                type="button"
                                                className={`audio-preview-mute${audioPreviewMuted ? ' is-muted' : ''}`}
                                                aria-pressed={audioPreviewMuted}
                                                onClick={() => {
                                                  // If turning ON the mute, cut any in-flight preview.
                                                  if (!audioPreviewMuted) stopAudioPreview();
                                                  setAudioPreviewMuted((m) => !m);
                                                }}
                                                title={audioPreviewMuted ? 'Unmute previews' : 'Mute previews'}
                                              >
                                                <img
                                                  src={audioPreviewMuted ? '/crt/icons/speaker_off.svg' : '/crt/icons/speaker_on.svg'}
                                                  alt=""
                                                />
                                                <span>{audioPreviewMuted ? 'Previews muted' : 'Mute previews'}</span>
                                              </button>
                                              {!audioPreviewNoticeOk && (
                                                <button
                                                  type="button"
                                                  className="audio-preview-notice"
                                                  onClick={() => setAudioPreviewNoticeOk(true)}
                                                  title="Click to dismiss"
                                                >
                                                  <span className="audio-preview-notice-icon" aria-hidden="true">⚠</span>
                                                  <span className="audio-preview-notice-text">
                                                    <b>Heads up:</b> hovering over an album triggers a 30-second
                                                    Spotify preview. Mute your speakers if you're somewhere quiet,
                                                    or use the bezel volume / system-tray speaker icon.
                                                  </span>
                                                  <span className="audio-preview-notice-ok">OK</span>
                                                </button>
                                              )}
                                              <p className="showcase-lib-blurb">
                                                You can hover over each song for a preview, or experience the full Winamp-style mini-player I built and integrated into the BOTEK desktop. Click{' '}
                                                <a
                                                  href="#"
                                                  className="showcase-link"
                                                  onClick={(e) => { e.preventDefault(); openWebamp(); }}
                                                ><b>Music</b></a>
                                                {' '}for the full versions of every track on a Sony hi-fi skin with Milkdrop visuals. Full playlist also on{' '}
                                                <a
                                                  href="https://open.spotify.com/playlist/1Lk0XE8oOv6gkymTJBux7M?si=0f07ffbbb43c4d73"
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="showcase-link"
                                                >Spotify</a>.
                                              </p>
                                              <div className="showcase-lib-grid">
                                                {audioData.map((track, i) => (
                                                  <a
                                                    key={i}
                                                    href={track.spotifyUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="showcase-lib-cover"
                                                    title={`${track.title} — ${track.artist}`}
                                                    onMouseEnter={() => playAudioPreview(track.previewUrl)}
                                                    onMouseLeave={stopAudioPreview}
                                                  >
                                                    <span className="showcase-lib-cover-frame">
                                                      <img src={track.coverUrl} alt={track.title} loading="lazy" />
                                                    </span>
                                                    <span className="showcase-lib-cover-meta">
                                                      <span className="showcase-lib-title">{track.title}</span>
                                                      <span className="showcase-lib-sub">{track.artist}</span>
                                                    </span>
                                                  </a>
                                                ))}
                                              </div>
                                            </>
                                          )}
                                          {showcaseLibTab === 'screens' && (
                                            <>
                                              <p className="showcase-lib-blurb">
                                                A curated collection of movies, shows, and games that have left a lasting impression.
                                                Click any tile for details and the trailer.
                                              </p>
                                              <div className="showcase-lib-filter">
                                                {[
                                                  ['all',    'All'],
                                                  ['movies', 'Movies'],
                                                  ['shows',  'Shows'],
                                                  ['games',  'Games'],
                                                ].map(([key, label]) => (
                                                  <button
                                                    key={key}
                                                    type="button"
                                                    className={`showcase-lib-filter-btn${showcaseScreensFilter === key ? ' active' : ''}`}
                                                    onClick={() => setShowcaseScreensFilter(key)}
                                                  >{label}</button>
                                                ))}
                                              </div>
                                              <div className="showcase-lib-grid">
                                                {screensData.map((item, i) => {
                                                  if (!matchesScreensFilter(item)) return null;
                                                  return (
                                                    <button
                                                      type="button"
                                                      key={i}
                                                      className="showcase-lib-cover"
                                                      title={`${item.title} — ${item.subtitle}`}
                                                      onClick={() => setShowcaseScreenIndex(i)}
                                                    >
                                                      <span className="showcase-lib-cover-frame">
                                                        <img src={item.coverImageUrl} alt={item.title} loading="lazy" />
                                                      </span>
                                                      <span className="showcase-lib-cover-meta">
                                                        <span className="showcase-lib-title">{item.title}</span>
                                                        <span className="showcase-lib-sub">{item.subtitle}</span>
                                                      </span>
                                                    </button>
                                                  );
                                                })}
                                                {screensData.filter(matchesScreensFilter).length === 0 && (
                                                  <p className="showcase-lib-empty">No matches in this category.</p>
                                                )}
                                              </div>
                                            </>
                                          )}
                                          {showcaseLibTab === 'pages' && (
                                            <>
                                              <p className="showcase-lib-blurb">
                                                Mostly philosophy, psychology, and theory — plus the occasional fiction I'm
                                                handed by people who keep me honest. Click any row to expand and read my notes.
                                              </p>
                                              <div className="showcase-lib-listview">
                                                <div className="showcase-lib-list-header">
                                                  <span className="col-toggle">{/* expand */}</span>
                                                  <span className="col-cover">{/* */}</span>
                                                  <span className="col-title">Title</span>
                                                  <span className="col-author">Author</span>
                                                </div>
                                                {booksData.map((book, i) => {
                                                  const expanded = showcaseBookIndex === i;
                                                  return (
                                                    <div
                                                      key={i}
                                                      className={`showcase-lib-list-group${expanded ? ' is-expanded' : ''}`}
                                                    >
                                                      <button
                                                        type="button"
                                                        className="showcase-lib-list-row"
                                                        onClick={() => setShowcaseBookIndex(expanded ? null : i)}
                                                        aria-expanded={expanded}
                                                      >
                                                        <span className="col-toggle">{expanded ? '−' : '+'}</span>
                                                        <span className="col-cover">
                                                          <img src={book.coverImageUrl} alt="" loading="lazy" />
                                                        </span>
                                                        <span className="col-title">{book.title}</span>
                                                        <span className="col-author">{book.author}</span>
                                                      </button>
                                                      {expanded && (
                                                        <div className="showcase-lib-list-detail">
                                                          <div className="showcase-book-detail-meta">
                                                            <div className="showcase-book-detail-cover">
                                                              <img src={book.coverImageUrl} alt="" />
                                                            </div>
                                                            <div className="showcase-book-detail-text">
                                                              <p className="showcase-book-detail-desc">{book.description}</p>
                                                              {book.link && (
                                                                <a
                                                                  className="showcase-link"
                                                                  href={book.link}
                                                                  target="_blank"
                                                                  rel="noopener noreferrer"
                                                                >View publisher page →</a>
                                                              )}
                                                            </div>
                                                          </div>
                                                          {book.highlights && book.highlights.length > 0 && (
                                                            <div className="showcase-book-notes">
                                                              <div className="showcase-book-notes-header">
                                                                <span className="showcase-book-notes-title">My Notes</span>
                                                                <span className="showcase-book-notes-count">
                                                                  {book.highlights.length} highlight{book.highlights.length === 1 ? '' : 's'}
                                                                </span>
                                                              </div>
                                                              <div className="showcase-book-notes-body">
                                                                {book.highlights.map((h, hi) => (
                                                                  <div key={hi} className="showcase-book-note">
                                                                    <p className="showcase-book-note-text">{h.text}</p>
                                                                    {h.page != null && (
                                                                      <p className="showcase-book-note-page">— p. {h.page}</p>
                                                                    )}
                                                                  </div>
                                                                ))}
                                                              </div>
                                                            </div>
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </>
                                          )}
                                          {showcaseLibTab === 'products' && (
                                            <>
                                              <p className="showcase-lib-blurb">
                                                The tools I actually use, plus a few corners of the internet I keep returning to.
                                                Click any tile for details.
                                              </p>
                                              <div className="showcase-lib-tile-grid">
                                                {products.map((p, i) => (
                                                  <button
                                                    type="button"
                                                    key={i}
                                                    className="showcase-lib-tile"
                                                    title={p.desc}
                                                    onClick={() => setShowcaseProductIndex(i)}
                                                  >
                                                    <span className="showcase-lib-tile-icon">
                                                      <img src={p.iconUrl} alt="" loading="lazy" />
                                                    </span>
                                                    <span className="showcase-lib-tile-name">{p.name}</span>
                                                  </button>
                                                ))}
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    {showcaseTab === 'projects' && (
                                      <div className="showcase-section showcase-experiments">
                                        <h2 className="showcase-section-heading">Experiments</h2>
                                        <p className="showcase-lib-blurb">
                                          A handful of things I've built or am still tinkering with.
                                          Click any tile for details.
                                        </p>
                                        <div className="showcase-exp-grid">
                                          {projectsData.map((p, i) => (
                                            <button
                                              type="button"
                                              key={p.id || i}
                                              className="showcase-exp-tile"
                                              title={`${p.title} — ${p.subtitle}`}
                                              onClick={() => setShowcaseExperimentIndex(i)}
                                              style={{ '--exp-accent': p.color || '#404040' }}
                                            >
                                              <span className="showcase-exp-tile-thumb">
                                                {p.image ? (
                                                  <img src={p.image} alt={p.title} loading="lazy" />
                                                ) : (
                                                  <span
                                                    className="showcase-exp-tile-icon"
                                                    style={{ background: p.color || '#404040' }}
                                                  >
                                                    {p.icon}
                                                  </span>
                                                )}
                                              </span>
                                              <span className="showcase-exp-tile-meta">
                                                <span className="showcase-exp-tile-title">{p.title}</span>
                                                <span className="showcase-exp-tile-sub">{p.subtitle}</span>
                                              </span>
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="showcase-statusbar">
                                <div className="win95-status-inset">© 2026 Boden Holland</div>
                                {showcaseTab === 'photography' && (
                                  <div className="win95-status-inset">
                                    {photographyData.length} item{photographyData.length === 1 ? '' : 's'}
                                  </div>
                                )}
                                {showcaseTab === 'library' && (
                                  <div className="win95-status-inset">
                                    {(() => {
                                      const screensCount = screensData.filter(matchesScreensFilter).length;
                                      const count = {
                                        audio: audioData.length,
                                        screens: screensCount,
                                        pages: booksData.length,
                                        products: products.length,
                                      }[showcaseLibTab] || 0;
                                      const filtered = showcaseLibTab === 'screens' && showcaseScreensFilter !== 'all';
                                      return `${count} item${count === 1 ? '' : 's'}${filtered ? ` (filtered)` : ''}`;
                                    })()}
                                  </div>
                                )}
                                {showcaseTab === 'projects' && (
                                  <div className="win95-status-inset">
                                    {projectsData.length} item{projectsData.length === 1 ? '' : 's'}
                                  </div>
                                )}
                              </div>
                              {!showcaseMaximized && !showcaseMinimized && (
                                <div
                                  className="crt-resize-grip"
                                  onMouseDown={onShowcaseResizeMouseDown}
                                  title="Drag to resize"
                                />
                              )}
                            </div>
                          )}
                          {/* README window — same chrome as Showcase, lives inside the desktop */}
                          {isReadmeOpen && (
                            <div
                              className={`showcase-window readme-window${readmeMaximized ? ' is-maximized' : ''}${readmeMinimized ? ' is-minimized' : ''}`}
                              style={readmeMaximized || readmeMinimized ? undefined : {
                                top: readmePos.top,
                                left: readmePos.left,
                                width: readmeSize.width,
                                height: readmeSize.height,
                              }}
                            >
                              <div
                                className="showcase-titlebar"
                                onMouseDown={onReadmeTitleMouseDown}
                                onDoubleClick={toggleReadmeMax}
                              >
                                <span className="showcase-titlebar-text">
                                  <img className="showcase-titlebar-icon" src="/crt/icons/readme.svg" alt="" />
                                  README.txt — Notepad
                                </span>
                                <div className="crt-win-btns">
                                  <div className="crt-win-btn" onClick={toggleReadmeMin}>_</div>
                                  <div className="crt-win-btn" onClick={toggleReadmeMax}>□</div>
                                  <div className="crt-win-btn crt-win-close" onClick={closeReadme}>×</div>
                                </div>
                              </div>
                              <div className="showcase-body showcase-body-section readme-showcase-body">
                                <div className="showcase-section">
                                  <h2 className="showcase-section-heading">Read Me</h2>
                                  <p className="showcase-section-body">
                                    This is Boden Holland's personal site, rendered as a
                                    1990s-era PC. The whole experience lives inside this
                                    monitor — desktop icons, games, my showcase, and all.
                                  </p>

                                  <h3 className="readme-h3">Getting around</h3>
                                  <ul className="readme-list">
                                    <li><b>Portfolio</b> opens a full portfolio explorer (about, library, experiments, photography, contact).</li>
                                    <li><b>The games</b> on the desktop run inside a real Internet Archive emulator. Double-click any to play.</li>
                                    <li><b>The Start menu</b> (bottom-left) has Credits and Shut Down.</li>
                                  </ul>

                                  <h3 className="readme-h3">Bezel controls</h3>
                                  <ul className="readme-list">
                                    <li><b>BRIGHTNESS</b>, <b>CONTRAST</b>, <b>VOLUME</b> — click to step through 0–6.</li>
                                    <li><b>POWER</b> — turns the PC off.</li>
                                    <li><b>Speaker icon</b> in the system tray (next to the clock) mutes / unmutes.</li>
                                  </ul>

                                  <h3 className="readme-h3">Keyboard</h3>
                                  <ul className="readme-list">
                                    <li><b>Shift + P</b> — enter or exit the PC from anywhere on the site.</li>
                                    <li><b>Esc</b> — releases input focus from a running game and closes its window. Won't power off the PC.</li>
                                    <li>To fully exit, click the <b>power button</b> on the monitor or <b>Start → Shut Down…</b></li>
                                  </ul>

                                  <h3 className="readme-h3">Game controls</h3>
                                  <table className="readme-table">
                                    <thead>
                                      <tr><th>Game</th><th>Controls</th><th>Notes</th></tr>
                                    </thead>
                                    <tbody>
                                      {retroGames.map((g) => (
                                        <tr key={g.id}>
                                          <td><b>{g.name}</b></td>
                                          <td>{g.controls}</td>
                                          <td>{g.instructions}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  <p className="readme-fineprint">
                                    Games are streamed from{' '}
                                    <a className="showcase-link" href="https://archive.org" target="_blank" rel="noopener noreferrer">archive.org</a>.
                                    If something won't load, their service is probably blinking — try again later.
                                  </p>
                                </div>
                              </div>
                              <div className="showcase-statusbar">
                                <div className="win95-status-inset">README.txt</div>
                                <div className="win95-status-inset" style={{ marginLeft: 'auto' }}>© 2026 Boden Holland</div>
                              </div>
                              {!readmeMaximized && !readmeMinimized && (
                                <div
                                  className="crt-resize-grip"
                                  onMouseDown={onReadmeResizeMouseDown}
                                  title="Drag to resize"
                                />
                              )}
                            </div>
                          )}
                          {/* Win95 Picture Viewer — overlays the showcase when a photo is open */}
                          {isShowcaseOpen && showcasePhotoIndex !== null && (
                            <div className="picture-viewer" onClick={() => setShowcasePhotoIndex(null)}>
                              <div className="picture-viewer-window" onClick={(e) => e.stopPropagation()}>
                                <div className="picture-viewer-titlebar">
                                  <span className="showcase-titlebar-text">
                                    <img className="showcase-titlebar-icon" src="/crt/icons/about.png" alt="" />
                                    {photographyData[showcasePhotoIndex].alt || `Image ${showcasePhotoIndex + 1}`} — Picture Viewer
                                  </span>
                                  <div className="crt-win-btns">
                                    <div
                                      className="crt-win-btn crt-win-close"
                                      onClick={() => setShowcasePhotoIndex(null)}
                                    >×</div>
                                  </div>
                                </div>
                                <div className="picture-viewer-body">
                                  <img
                                    className="picture-viewer-image"
                                    src={photographyData[showcasePhotoIndex].src}
                                    alt={photographyData[showcasePhotoIndex].alt || ''}
                                  />
                                </div>
                                <div className="picture-viewer-toolbar">
                                  <button
                                    type="button"
                                    className="win95-button picture-viewer-nav"
                                    onClick={() => setShowcasePhotoIndex(
                                      (showcasePhotoIndex - 1 + photographyData.length) % photographyData.length
                                    )}
                                    title="Previous (←)"
                                  >‹ Prev</button>
                                  <div className="picture-viewer-counter">
                                    {showcasePhotoIndex + 1} / {photographyData.length}
                                  </div>
                                  <button
                                    type="button"
                                    className="win95-button picture-viewer-nav"
                                    onClick={() => setShowcasePhotoIndex(
                                      (showcasePhotoIndex + 1) % photographyData.length
                                    )}
                                    title="Next (→)"
                                  >Next ›</button>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Experiments detail viewer — Win95 properties-style window
                              showing description, image or iframe, and link buttons. */}
                          {isShowcaseOpen && showcaseExperimentIndex !== null && (() => {
                            const p = projectsData[showcaseExperimentIndex];
                            if (!p) return null;
                            const paragraphs = p.longerDesc && p.longerDesc.length > 0
                              ? p.longerDesc
                              : [p.description];
                            return (
                              <div
                                className="picture-viewer"
                                onClick={() => setShowcaseExperimentIndex(null)}
                              >
                                <div className="screen-detail" onClick={(e) => e.stopPropagation()}>
                                  <div className="picture-viewer-titlebar">
                                    <span className="showcase-titlebar-text">
                                      <img className="showcase-titlebar-icon" src="/crt/icons/about.png" alt="" />
                                      {p.title} — Details
                                    </span>
                                    <div className="crt-win-btns">
                                      <div
                                        className="crt-win-btn crt-win-close"
                                        onClick={() => setShowcaseExperimentIndex(null)}
                                      >×</div>
                                    </div>
                                  </div>
                                  <div className="screen-detail-body">
                                    <div className="exp-detail-header" style={{ '--exp-accent': p.color || '#404040' }}>
                                      <span className="exp-detail-icon">{p.icon}</span>
                                      <div className="exp-detail-titles">
                                        <h3 className="screen-detail-title">{p.title}</h3>
                                        <p className="screen-detail-subtitle">{p.subtitle}</p>
                                      </div>
                                    </div>
                                    {p.iframeDemo || p.iframe ? (
                                      <div className="exp-detail-iframe">
                                        <iframe
                                          src={p.iframeDemo || p.iframe}
                                          title={`${p.title} demo`}
                                          allow="accelerometer; gyroscope"
                                        />
                                      </div>
                                    ) : p.image ? (
                                      <div className="exp-detail-image">
                                        <img src={p.image} alt={p.title} />
                                      </div>
                                    ) : null}
                                    <div className="exp-detail-text">
                                      {paragraphs.map((para, idx) => (
                                        <p key={idx} className="screen-detail-desc">{para}</p>
                                      ))}
                                    </div>
                                    {(p.links?.length > 0 || p.id === 'lightfixtures') && (
                                      <div className="exp-detail-links">
                                        {p.links && p.links.map((link, li) => (
                                          <a
                                            key={li}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="win95-button exp-detail-link"
                                          >{link.label} →</a>
                                        ))}
                                        {p.id === 'lightfixtures' && (
                                          <button
                                            type="button"
                                            className="win95-button exp-detail-link"
                                            onClick={() => setShowcaseFixturesOpen((v) => !v)}
                                          >
                                            {showcaseFixturesOpen ? 'Hide Fixtures' : 'Explore Fixtures'} {showcaseFixturesOpen ? '▴' : '▾'}
                                          </button>
                                        )}
                                      </div>
                                    )}

                                    {p.id === 'lightfixtures' && showcaseFixturesOpen && (
                                      <div className="exp-detail-fixtures">
                                        <div className="exp-detail-fixtures-header">
                                          <span className="exp-detail-fixtures-label">Light Fixtures Portfolio</span>
                                          <span className="exp-detail-fixtures-count">
                                            {lightFixturesData.length} fixture{lightFixturesData.length === 1 ? '' : 's'}
                                          </span>
                                        </div>
                                        <div className="exp-detail-fixtures-body">
                                          {lightFixturesData.map((fix, fi) => (
                                            <div key={fi} className="exp-detail-fixture">
                                              <h4 className="exp-detail-fixture-title">{fix.title}</h4>
                                              <p className="exp-detail-fixture-desc">{fix.description}</p>
                                              {fix.images && fix.images.length > 0 && (
                                                <div className="exp-detail-fixture-gallery">
                                                  {fix.images.map((img, ii) => (
                                                    <button
                                                      type="button"
                                                      key={ii}
                                                      className="exp-detail-fixture-thumb"
                                                      onClick={() => setShowcaseFixtureImage({
                                                        src: img,
                                                        alt: `${fix.title} ${ii + 1}`,
                                                        title: fix.title,
                                                      })}
                                                      title="Click to enlarge"
                                                    >
                                                      <img src={img} alt={`${fix.title} ${ii + 1}`} loading="lazy" />
                                                    </button>
                                                  ))}
                                                </div>
                                              )}
                                              {fix.videos && fix.videos.length > 0 && (
                                                <div className="exp-detail-fixture-videos">
                                                  {fix.videos.map((vid, vi) => (
                                                    <div key={vi} className="exp-detail-fixture-video">
                                                      <iframe
                                                        src={`https://www.youtube.com/embed/${vid}?rel=0`}
                                                        title={`${fix.title} clip ${vi + 1}`}
                                                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                      />
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="screen-detail-toolbar">
                                    <button
                                      type="button"
                                      className="win95-button"
                                      onClick={() => setShowcaseExperimentIndex(
                                        (showcaseExperimentIndex - 1 + projectsData.length) % projectsData.length
                                      )}
                                      title="Previous (←)"
                                    >‹ Prev</button>
                                    <div className="picture-viewer-counter">
                                      {showcaseExperimentIndex + 1} / {projectsData.length}
                                    </div>
                                    <button
                                      type="button"
                                      className="win95-button"
                                      onClick={() => setShowcaseExperimentIndex(
                                        (showcaseExperimentIndex + 1) % projectsData.length
                                      )}
                                      title="Next (→)"
                                    >Next ›</button>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                          {/* Fixture image picture viewer — opens over an Experiments modal */}
                          {isShowcaseOpen && showcaseFixtureImage && (
                            <div
                              className="picture-viewer fixture-image-viewer"
                              onClick={() => setShowcaseFixtureImage(null)}
                            >
                              <div className="picture-viewer-window" onClick={(e) => e.stopPropagation()}>
                                <div className="picture-viewer-titlebar">
                                  <span className="showcase-titlebar-text">
                                    <img className="showcase-titlebar-icon" src="/crt/icons/about.png" alt="" />
                                    {showcaseFixtureImage.title} — Picture Viewer
                                  </span>
                                  <div className="crt-win-btns">
                                    <div
                                      className="crt-win-btn crt-win-close"
                                      onClick={() => setShowcaseFixtureImage(null)}
                                    >×</div>
                                  </div>
                                </div>
                                <div className="picture-viewer-body">
                                  <img
                                    className="picture-viewer-image"
                                    src={showcaseFixtureImage.src}
                                    alt={showcaseFixtureImage.alt}
                                  />
                                </div>
                                <div className="picture-viewer-toolbar">
                                  <button
                                    type="button"
                                    className="win95-button"
                                    onClick={() => setShowcaseFixtureImage(null)}
                                  >Close</button>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Products detail viewer — Win95 properties-style window */}
                          {isShowcaseOpen && showcaseProductIndex !== null && (() => {
                            const p = products[showcaseProductIndex];
                            if (!p) return null;
                            return (
                              <div
                                className="picture-viewer"
                                onClick={() => setShowcaseProductIndex(null)}
                              >
                                <div className="screen-detail" onClick={(e) => e.stopPropagation()}>
                                  <div className="picture-viewer-titlebar">
                                    <span className="showcase-titlebar-text">
                                      <img className="showcase-titlebar-icon" src="/crt/icons/about.png" alt="" />
                                      {p.name} — Properties
                                    </span>
                                    <div className="crt-win-btns">
                                      <div
                                        className="crt-win-btn crt-win-close"
                                        onClick={() => setShowcaseProductIndex(null)}
                                      >×</div>
                                    </div>
                                  </div>
                                  <div className="screen-detail-body">
                                    <div className="screen-detail-meta">
                                      <div className="screen-detail-cover product-detail-cover">
                                        <img src={p.iconUrl} alt={p.name} />
                                      </div>
                                      <div className="screen-detail-text">
                                        <h3 className="screen-detail-title">{p.name}</h3>
                                        <p className="screen-detail-desc">{p.desc}</p>
                                        {p.longerDesc && (
                                          <p className="screen-detail-desc" style={{ marginTop: 10 }}>
                                            {p.longerDesc}
                                          </p>
                                        )}
                                        {p.link && (
                                          <p style={{ marginTop: 12 }}>
                                            <a
                                              className="showcase-link"
                                              href={p.link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >{(() => {
                                              try { return new URL(p.link).hostname.replace(/^www\./, ''); }
                                              catch { return 'Open link'; }
                                            })()} →</a>
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="screen-detail-toolbar">
                                    <button
                                      type="button"
                                      className="win95-button"
                                      onClick={() => setShowcaseProductIndex(
                                        (showcaseProductIndex - 1 + products.length) % products.length
                                      )}
                                      title="Previous (←)"
                                    >‹ Prev</button>
                                    <div className="picture-viewer-counter">
                                      {showcaseProductIndex + 1} / {products.length}
                                    </div>
                                    <button
                                      type="button"
                                      className="win95-button"
                                      onClick={() => setShowcaseProductIndex(
                                        (showcaseProductIndex + 1) % products.length
                                      )}
                                      title="Next (→)"
                                    >Next ›</button>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                          {/* Screens detail viewer — Win95 properties-style window
                              with title, description, and embedded YouTube trailer */}
                          {isShowcaseOpen && showcaseScreenIndex !== null && (() => {
                            const item = screensData[showcaseScreenIndex];
                            if (!item) return null;
                            return (
                              <div
                                className="picture-viewer"
                                onClick={() => setShowcaseScreenIndex(null)}
                              >
                                <div className="screen-detail" onClick={(e) => e.stopPropagation()}>
                                  <div className="picture-viewer-titlebar">
                                    <span className="showcase-titlebar-text">
                                      <img className="showcase-titlebar-icon" src="/crt/icons/about.png" alt="" />
                                      {item.title} — Details
                                    </span>
                                    <div className="crt-win-btns">
                                      <div
                                        className="crt-win-btn crt-win-close"
                                        onClick={() => setShowcaseScreenIndex(null)}
                                      >×</div>
                                    </div>
                                  </div>
                                  <div className="screen-detail-body">
                                    <div className="screen-detail-meta">
                                      <div className="screen-detail-cover">
                                        <img src={item.coverImageUrl} alt={item.title} />
                                      </div>
                                      <div className="screen-detail-text">
                                        <h3 className="screen-detail-title">{item.title}</h3>
                                        <p className="screen-detail-subtitle">{item.subtitle}</p>
                                        <p className="screen-detail-desc">{item.description}</p>
                                      </div>
                                    </div>
                                    {item.trailerId && (
                                      <div className="screen-detail-trailer">
                                        <div className="screen-detail-trailer-label">Trailer</div>
                                        <div className="screen-detail-trailer-frame">
                                          <iframe
                                            src={`https://www.youtube.com/embed/${item.trailerId}?rel=0`}
                                            title={`${item.title} trailer`}
                                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="screen-detail-toolbar">
                                    <button
                                      type="button"
                                      className="win95-button"
                                      onClick={() => setShowcaseScreenIndex(stepScreenIndex(-1))}
                                      title="Previous (←)"
                                    >‹ Prev</button>
                                    <div className="picture-viewer-counter">
                                      {(() => {
                                        const indices = filteredScreenIndices();
                                        const pos = indices.indexOf(showcaseScreenIndex);
                                        return `${pos === -1 ? '?' : pos + 1} / ${indices.length}`;
                                      })()}
                                    </div>
                                    <button
                                      type="button"
                                      className="win95-button"
                                      onClick={() => setShowcaseScreenIndex(stepScreenIndex(1))}
                                      title="Next (→)"
                                    >Next ›</button>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        {/* Start menu — Win95 reference 1:1: vertical
                            "Windows 95"-style sidebar, colorful icons, full
                            menu item list with submenu arrows on the upper
                            items and a separator above Shut down. */}
                        {isStartMenuOpen && (
                          <div
                            className="crt-start-menu"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="crt-start-menu-inner">
                              <div className="crt-start-menu-side" aria-hidden="true">
                                <span className="crt-start-menu-side-text">BOTEK 92</span>
                              </div>
                              <div className="crt-start-menu-content">
                                <button
                                  className="crt-start-menu-item"
                                  onClick={() => { setIsStartMenuOpen(false); setShowCreditsModal(true); }}
                                >
                                  <img className="crt-menu-icon" src="/crt/icons/about.png" alt="" />
                                  <span className="crt-menu-label"><u>A</u>bout</span>
                                </button>
                                <div className="crt-start-menu-sep" />
                                <button
                                  className="crt-start-menu-item"
                                  onClick={() => { setIsStartMenuOpen(false); setIsShutdownConfirmOpen(true); }}
                                >
                                  <img className="crt-menu-icon" src="/crt/icons/shutdown.svg" alt="" />
                                  <span className="crt-menu-label">Sh<u>u</u>t Down...</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Taskbar — only after the screen has fully booted
                            to the desktop. The taskbar sits at z-index 9100,
                            ABOVE the gray off-state panel (8000) and visible
                            through the DOS layer while its opacity is < 1,
                            so without this gate the Start button + tray
                            would peek through during the warm-up. */}
                        {crtScreenAwake && !isBootingUp && !isWindowsLoading && !isShuttingDown && (
                        <div className="crt-taskbar">
                          <button
                            className="crt-start-btn"
                            onClick={() => setIsStartMenuOpen(prev => !prev)}
                          >
                            <div className="win95-logo">
                              <span className="logo-r1" /><span className="logo-r2" />
                              <span className="logo-r3" /><span className="logo-r4" />
                            </div>
                            Start
                          </button>
                          <div className="crt-taskbar-sep" />
                          {showGame && (
                            <div className="crt-taskbar-pill">
                              🖥 {currentGame.name}
                            </div>
                          )}
                          {isShowcaseOpen && (
                            <div
                              className={`crt-taskbar-pill${showcaseMinimized ? '' : ' crt-taskbar-pill-active'}`}
                              onClick={toggleShowcaseMin}
                              title={showcaseMinimized ? 'Restore' : 'Minimize'}
                            >
                              <img
                                src="/crt/icons/portfolio.png"
                                alt=""
                                style={{ width: 14, height: 14, imageRendering: 'pixelated', verticalAlign: 'middle' }}
                              /> Portfolio
                            </div>
                          )}
                          {isReadmeOpen && (
                            <div
                              className={`crt-taskbar-pill${readmeMinimized ? '' : ' crt-taskbar-pill-active'}`}
                              onClick={toggleReadmeMin}
                              title={readmeMinimized ? 'Restore' : 'Minimize'}
                            >
                              <img
                                src="/crt/icons/readme.svg"
                                alt=""
                                style={{ width: 14, height: 14, imageRendering: 'pixelated', verticalAlign: 'middle' }}
                              /> README.txt
                            </div>
                          )}
                          {isWebampOpen && (
                            <div
                              className="crt-taskbar-pill crt-taskbar-pill-active"
                              onClick={() => setIsWebampOpen(false)}
                              title="Close Music"
                            >
                              🎵 Music
                            </div>
                          )}
                          {isBrowserOpen && (
                            <div
                              className={`crt-taskbar-pill${browserMinimized ? '' : ' crt-taskbar-pill-active'}`}
                              onClick={toggleBrowserMin}
                              title={browserMinimized ? 'Restore' : 'Minimize'}
                            >
                              <img
                                src="/crt/icons/browser.png"
                                alt=""
                                style={{ width: 14, height: 14, verticalAlign: 'middle', imageRendering: 'pixelated' }}
                              /> The Internet
                            </div>
                          )}
                          {/* System tray — speaker mute + clock, period-correct */}
                          <div className="crt-system-tray">
                            <button
                              className="crt-tray-speaker"
                              onClick={() => {
                                try { playMonitorClick(); } catch {}
                                setIsCrtMuted((m) => !m);
                              }}
                              title={isCrtMuted ? 'Unmute' : 'Mute'}
                              aria-label={isCrtMuted ? 'Unmute' : 'Mute'}
                            >
                              <img
                                src={isCrtMuted ? '/crt/icons/speaker_off.svg' : '/crt/icons/speaker_on.svg'}
                                alt=""
                              />
                            </button>
                            <Win95Clock />
                          </div>
                        </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Bottom control panel */}
                  <div className="crt-controls">
                    <div className="crt-brand">BOTEK™</div>
                    <div className="crt-buttons-row">
                      {showGame && currentGame.controls?.includes('5:') && (
                        <>
                          <div
                            className="crt-arcade-btn coin"
                            onClick={() => {
                              try { playMonitorClick(); } catch {}
                              const iframe = document.querySelector('.crt-game-iframe');
                              if (iframe) iframe.focus();
                              setStatusMessage('PRESS 5 ON KEYBOARD');
                              setTimeout(() => setStatusMessage('Ready'), 3000);
                            }}
                          >
                            <div className="arcade-inner" />
                            <span className="arcade-label">COIN</span>
                          </div>
                          <div
                            className="crt-arcade-btn start-p1"
                            onClick={() => {
                              try { playMonitorClick(); } catch {}
                              const iframe = document.querySelector('.crt-game-iframe');
                              if (iframe) iframe.focus();
                              setStatusMessage('PRESS 1 ON KEYBOARD');
                              setTimeout(() => setStatusMessage('Ready'), 3000);
                            }}
                          >
                            <div className="arcade-inner" />
                            <span className="arcade-label">START</span>
                          </div>
                        </>
                      )}
                      {/* Brightness dial */}
                      <div className="crt-control-group">
                        <button
                          className="crt-knob"
                          title="Brightness"
                          aria-label={`Brightness ${brightnessStep}/6`}
                          onClick={() => {
                            try { playKnobClick(); } catch {}
                            setBrightnessStep((s) => (s + 1) % 7);
                          }}
                          style={{ transform: `rotate(${(brightnessStep - 3) * 36}deg)` }}
                        >
                          <span className="crt-knob-notch" />
                        </button>
                        <span className="crt-control-label">BRIGHTNESS</span>
                      </div>

                      {/* Contrast dial */}
                      <div className="crt-control-group">
                        <button
                          className="crt-knob"
                          title="Contrast"
                          aria-label={`Contrast ${contrastStep}/6`}
                          onClick={() => {
                            try { playKnobClick(); } catch {}
                            setContrastStep((s) => (s + 1) % 7);
                          }}
                          style={{ transform: `rotate(${(contrastStep - 3) * 36}deg)` }}
                        >
                          <span className="crt-knob-notch" />
                        </button>
                        <span className="crt-control-label">CONTRAST</span>
                      </div>

                      {/* Volume dial — maps to audio masterVolume */}
                      <div className="crt-control-group">
                        <button
                          className="crt-knob"
                          title="Volume"
                          aria-label={`Volume ${volumeStep}/6`}
                          onClick={() => {
                            try { playKnobClick(); } catch {}
                            setVolumeStep((s) => (s + 1) % 7);
                          }}
                          style={{ transform: `rotate(${(volumeStep - 3) * 36}deg)` }}
                        >
                          <span className="crt-knob-notch" />
                        </button>
                        <span className="crt-control-label">VOLUME</span>
                      </div>

                      {/* Power button + label */}
                      <div className="crt-control-group">
                        <div
                          className="crt-power-btn"
                          onClick={() => {
                            if (isPoweringOff) return;
                            try { playPowerOff(); } catch {}
                            try { stopAmbient({ fade: 250 }); } catch {}
                            setIsStartMenuOpen(false);
                            setIsPoweringOff(true);
                            // Animation duration is tuned to the ~1.03s click sound:
                            // 80ms flash, 250ms collapse to line, 320ms shrink to dot,
                            // 300ms fade out. Then exit retro mode.
                            setTimeout(() => {
                              setIsRetroMode(false);
                              setIsPoweringOff(false);
                              setShowGame(false);
                              setIsWebampOpen(false);
                              try { window.localStorage.setItem('site-mode', 'modern'); } catch { /* ignore */ }
                            }, 1000);
                          }}
                        >
                          <div className="crt-power-led" />
                        </div>
                        <span className="crt-control-label">POWER</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Monitor Stand */}
                <div className="crt-neck" />
                <div className="crt-base" />

                {showInfoModal && (
                  <div className="win95-popup info-popup">
                    <div className="popup-title">
                      <span>System Information</span>
                      <button className="popup-close" onClick={() => setShowInfoModal(false)}>×</button>
                    </div>
                    <div className="popup-body">
                      <div className="win95-info-icon">
                        <Info size={32} color="#000080" />
                      </div>
                      <div className="win95-info-text">
                        <p><strong>Notice:</strong></p>
                        <p>I am using the Internet Archive to emulate these games. At times the Archive can go down, so if something isn't loading, their services are probably experiencing issues.</p>
                      </div>
                      <button className="popup-ok" onClick={() => setShowInfoModal(false)}>OK</button>
                    </div>
                  </div>
                )}

                {isRecycleBinOpen && (
                  <div className="win95-popup recyclebin-popup">
                    <div className="popup-title">
                      <span>Recycle Bin</span>
                      <button className="popup-close" onClick={() => setIsRecycleBinOpen(false)}>×</button>
                    </div>
                    <div className="popup-body recyclebin-body">
                      <button
                        type="button"
                        className="recyclebin-image-btn"
                        onClick={() => setIsRecycleImgOpen(true)}
                        title="Click to enlarge"
                      >
                        <img
                          src="/recyclebin/young_computers_great_fun.jpg"
                          alt="A young Boden delighted by an early laptop"
                        />
                      </button>
                      <p className="recyclebin-caption">computers have always been great fun</p>
                    </div>
                  </div>
                )}

                {isRecycleImgOpen && (
                  <div
                    className="picture-viewer recycle-img-viewer"
                    onClick={() => setIsRecycleImgOpen(false)}
                  >
                    <div className="picture-viewer-window" onClick={(e) => e.stopPropagation()}>
                      <div className="picture-viewer-titlebar">
                        <span className="showcase-titlebar-text">
                          <img className="showcase-titlebar-icon" src="/crt/icons/recyclebin.png" alt="" />
                          computers have always been great fun
                        </span>
                        <div className="crt-win-btns">
                          <div
                            className="crt-win-btn crt-win-close"
                            onClick={() => setIsRecycleImgOpen(false)}
                          >×</div>
                        </div>
                      </div>
                      <div className="picture-viewer-body">
                        <img
                          className="picture-viewer-image"
                          src="/recyclebin/young_computers_great_fun.jpg"
                          alt="A young Boden delighted by an early laptop"
                        />
                      </div>
                      <div className="picture-viewer-toolbar">
                        <div className="picture-viewer-counter" style={{ flex: 1, textAlign: 'left' }}>
                          computers have always been great fun
                        </div>
                        <button
                          type="button"
                          className="win95-button"
                          onClick={() => setIsRecycleImgOpen(false)}
                        >Close</button>
                      </div>
                    </div>
                  </div>
                )}

                {showCreditsModal && (
                  <div className="win95-popup credits-popup">
                    <div className="popup-title">
                      <span>Credits</span>
                      <button className="popup-close" onClick={() => setShowCreditsModal(false)}>×</button>
                    </div>
                    <div className="popup-body credits-body">
                      <div className="credits-header">
                        <h2 className="credits-title">BOTEK<sup>™</sup></h2>
                        <p className="credits-subtitle">bodenholland.com — 2026</p>
                      </div>
                      <div className="credits-section">
                        <h3>Idea &amp; Direction</h3>
                        <div className="credits-row">
                          <span>Boden Holland</span><span>All</span>
                        </div>
                      </div>
                      <div className="credits-section">
                        <h3>Inspiration</h3>
                        <div className="credits-row">
                          <span>Henry Heffernan</span><span>Desktop UI / smudge + glass / sound design palette</span>
                        </div>
                      </div>
                      <div className="credits-section">
                        <h3>Games</h3>
                        <div className="credits-row">
                          <span>archive.org</span><span>In-browser emulation</span>
                        </div>
                      </div>
                      <div className="credits-section">
                        <h3>Built With</h3>
                        <div className="credits-row">
                          <span>React 19 + Vite</span><span>Front end</span>
                        </div>
                        <div className="credits-row">
                          <span>framer-motion / suncalc</span><span>Misc</span>
                        </div>
                      </div>
                      <button className="popup-ok" onClick={() => setShowCreditsModal(false)}>OK</button>
                    </div>
                  </div>
                )}

                {isShutdownConfirmOpen && (
                  <div
                    className="win95-popup shutdown-confirm-popup"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="popup-title">
                      <span>Shut Down Windows</span>
                      <button
                        className="popup-close"
                        onClick={() => setIsShutdownConfirmOpen(false)}
                      >×</button>
                    </div>
                    <div className="popup-body shutdown-confirm-body">
                      <div className="shutdown-confirm-icon">
                        <img src="/crt/icons/shutdown-big.svg" alt="" />
                      </div>
                      <div className="shutdown-confirm-content">
                        <p className="shutdown-confirm-prompt">Are you sure you want to:</p>
                        <label className="shutdown-radio">
                          <input
                            type="radio"
                            name="shutdownChoice"
                            value="shutdown"
                            checked={shutdownChoice === 'shutdown'}
                            onChange={() => setShutdownChoice('shutdown')}
                          />
                          <span><u>S</u>hut down the computer?</span>
                        </label>
                        <label className="shutdown-radio">
                          <input
                            type="radio"
                            name="shutdownChoice"
                            value="restart"
                            checked={shutdownChoice === 'restart'}
                            onChange={() => setShutdownChoice('restart')}
                          />
                          <span><u>R</u>estart the computer?</span>
                        </label>
                        <label className="shutdown-radio">
                          <input
                            type="radio"
                            name="shutdownChoice"
                            value="dos"
                            checked={shutdownChoice === 'dos'}
                            onChange={() => setShutdownChoice('dos')}
                          />
                          <span>Restart the computer in <u>M</u>S-DOS mode?</span>
                        </label>
                        <label className="shutdown-radio">
                          <input
                            type="radio"
                            name="shutdownChoice"
                            value="logoff"
                            checked={shutdownChoice === 'logoff'}
                            onChange={() => setShutdownChoice('logoff')}
                          />
                          <span><u>C</u>lose all programs and log on as a different user?</span>
                        </label>
                      </div>
                    </div>
                    <div className="shutdown-confirm-buttons">
                      <button
                        className="win95-button"
                        onMouseDown={() => { try { playMouseDown(); } catch {} }}
                        onMouseUp={() => { try { playMouseUp(); } catch {} }}
                        onClick={() => {
                          setIsShutdownConfirmOpen(false);
                          // Any choice → run the DOS shutdown sequence.
                          handleShutdown();
                        }}
                      >Yes</button>
                      <button
                        className="win95-button"
                        onMouseDown={() => { try { playMouseDown(); } catch {} }}
                        onMouseUp={() => { try { playMouseUp(); } catch {} }}
                        onClick={() => setIsShutdownConfirmOpen(false)}
                      >No</button>
                      <button
                        className="win95-button"
                        onMouseDown={() => { try { playMouseDown(); } catch {} }}
                        onMouseUp={() => { try { playMouseUp(); } catch {} }}
                        onClick={() => setIsShutdownHelpOpen(true)}
                      >Help</button>
                    </div>
                  </div>
                )}

                {/* Help modal — opens from the Shut Down dialog's Help button.
                    Win95-styled like the other popups; only action is dismiss. */}
                {isShutdownHelpOpen && (
                  <div
                    className="win95-popup shutdown-help-popup"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="popup-title">
                      <span>Help</span>
                      <button
                        className="popup-close"
                        onClick={() => setIsShutdownHelpOpen(false)}
                      >×</button>
                    </div>
                    <div className="popup-body shutdown-help-body">
                      <p className="shutdown-help-text">
                        Sorry to hear you&rsquo;re having an issue. To contact
                        support, please email{' '}
                        <a href="mailto:hello@bodenholland.com">hello@bodenholland.com</a>.
                      </p>
                    </div>
                    <div className="shutdown-confirm-buttons">
                      <button
                        className="win95-button"
                        onMouseDown={() => { try { playMouseDown(); } catch {} }}
                        onMouseUp={() => { try { playMouseUp(); } catch {} }}
                        onClick={() => setIsShutdownHelpOpen(false)}
                      >OK</button>
                    </div>
                  </div>
                )}


                {/* Under-monitor manual + esc hint removed — that content
                    now lives in README.txt on the desktop. */}
              </motion.div>
            )}
          </motion.div>
        );
      /* RETRO MODE is rendered outside the section, as a fixed full-screen overlay – see below */
      case 'reading':
        return (
          <div className="section-content">
            <div className="section-head">
              <div className="library-tabs" ref={tabsRef}>
                <button 
                  className={`library-tab-btn ${libraryTab === 'audio' ? 'active' : ''}`}
                  onClick={() => setLibraryTab('audio')}
                >
                  Audio
                  {libraryTab === 'audio' && (
                    <motion.div 
                      layoutId="library-underline"
                      className="library-tab-underline"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
                <button 
                  className={`library-tab-btn ${libraryTab === 'screens' ? 'active' : ''}`}
                  onClick={() => setLibraryTab('screens')}
                >
                  Screens
                  {libraryTab === 'screens' && (
                    <motion.div 
                      layoutId="library-underline"
                      className="library-tab-underline"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
                <button 
                  className={`library-tab-btn ${libraryTab === 'pages' ? 'active' : ''}`}
                  onClick={() => setLibraryTab('pages')}
                >
                  Pages
                  {libraryTab === 'pages' && (
                    <motion.div 
                      layoutId="library-underline"
                      className="library-tab-underline"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
                <button 
                  className={`library-tab-btn ${libraryTab === 'products' ? 'active' : ''}`}
                  onClick={() => setLibraryTab('products')}
                >
                  Products
                  {libraryTab === 'products' && (
                    <motion.div 
                      layoutId="library-underline"
                      className="library-tab-underline"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              </div>
              <p className="section-description">
                {libraryTab === 'audio' && (
                  <>
                    Just some tracks I’ve probably played one too many times lately. If you are on desktop, you can preview a track by hovering over the album art. Make sure to unmute the page first to hear the audio. I've kept it muted by default because there is nothing worse than unexpected audio blasting out of your speakers at the coffee shop. You can also browse the playlist on <a href="https://open.spotify.com/playlist/1Lk0XE8oOv6gkymTJBux7M?si=0f07ffbbb43c4d73" target="_blank" rel="noopener noreferrer" className="spotify-link">Spotify</a>.
                  </>
                )}
                {libraryTab === 'screens' && "A curated collection of movies, shows, and games that have left a lasting impression."}
                {libraryTab === 'pages' && "I tend to spend most of my reading time on philosophy, psychology, and theory. Luckily, I have people in my life who keep me balanced by sharing great fiction and poetry."}
                {libraryTab === 'products' && "A collection of the things I love. From the tools I use every day to the objects I just appreciate having around and the corners of the internet I find myself returning to."}
              </p>
              {libraryTab === 'screens' && (
                <div className="screens-sub-tabs">
                  {['all', 'movies', 'shows', 'games'].map(subTab => (
                    <button 
                      key={subTab}
                      className={`sub-tab-btn ${screensSubTab === subTab ? 'active' : ''}`}
                      onClick={() => setScreensSubTab(subTab)}
                    >
                      {subTab.charAt(0).toUpperCase() + subTab.slice(1)}
                    </button>
                  ))}
                </div>
              )}
              {libraryTab === 'audio' && (
                <button 
                  className={`audio-mute-toggle ${!isAudioMuted ? 'unmuted' : ''}`}
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  title={isAudioMuted ? "Unmute Previews" : "Mute Previews"}
                >
                  {isAudioMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  <span>{isAudioMuted ? "Muted" : "Unmuted"}</span>
                </button>
              )}
            </div>
            
            {libraryTab === 'pages' ? (
              <div className="books-shelf">
                {booksData.map(item => {
                  const isOpened = openedBook?.title === item.title;
                  return (
                    <motion.div 
                      layoutId={`book-container-${item.title}`}
                      key={item.title} 
                      className="book-container"
                      onClick={() => { setBookPageIndex(0); setOpenedBook(item); playBookSfx('open'); }}
                      style={{ opacity: isOpened ? 0 : 1 }} 
                      whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                    >
                      <div className="book-3d-wrapper">
                        <div className="book-pages"></div>
                        <motion.div 
                          className="book-hinge"
                          style={{ originX: 0 }}
                        >
                          <div 
                            className="book-cover-front" 
                            style={{ 
                              backgroundImage: `url(${item.coverImageUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundColor: '#e2e8f0',
                            }}
                          ></div>
                          <div className="book-cover-back"></div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : libraryTab === 'screens' ? (
              <div className="screens-grid">
                {screensData
                  .filter(item => {
                    if (screensSubTab === 'all') return true;
                    if (screensSubTab === 'movies') return item.subtitle.toLowerCase().includes('movie');
                    if (screensSubTab === 'shows') return item.subtitle.toLowerCase().includes('tv series') || item.subtitle.toLowerCase().includes('show');
                    if (screensSubTab === 'games') return item.subtitle.toLowerCase().includes('game');
                    return true;
                  })
                  .map(item => {
                    const isOpened = openedBook?.title === item.title;
                    return (
                      <motion.div 
                        layoutId={`screen-container-${item.title}`}
                        key={item.title} 
                        className="poster-card"
                        onClick={() => { setBookPageIndex(0); setOpenedBook(item); playBookSfx('open'); }}
                        style={{ opacity: isOpened ? 0 : 1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="poster-wrapper">
                          <img src={item.coverImageUrl} alt={item.title} className="poster-img" />
                          <div className="poster-overlay">
                            <h4>{item.title}</h4>
                            <span>{item.subtitle}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            ) : libraryTab === 'products' ? (
              <div className="favorites-grid">
                {products.map(p => (
                  <motion.div
                    layoutId={`product-${p.name}`}
                    key={p.name}
                    className={`favorite-card${p.expandable ? ' is-expandable' : ''}`}
                    onClick={() => {
                      if (p.expandable) {
                        setExpandedProduct(p);
                      } else {
                        window.open(p.link, '_blank');
                      }
                    }}
                    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                  >
                    <div className="favorite-card-icon">
                      {p.iconUrl && (
                        <img src={p.iconUrl} alt={`${p.name} icon`} />
                      )}
                    </div>
                    <div className="favorite-card-text">
                      <h3 className="favorite-card-name">{p.name}</h3>
                      <p className="favorite-card-desc">
                        {p.desc}{p.expandable && '…'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="audio-grid discover-style">
                {audioData.map((item, idx) => (
                  <AudioCard 
                    key={idx} 
                    item={item} 
                    index={idx} 
                    onPlay={(url) => {
                      if (audioRef.current && !isAudioMuted) {
                        audioRef.current.src = url;
                        audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
                      }
                    }}
                    onStop={() => {
                      if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                      }
                    }}
                  />
                ))}
                <audio ref={audioRef} style={{ display: 'none' }} />
              </div>
            )}

            {/* Overlay for opened book */}
            <AnimatePresence>
              {openedBook && (
                <div className="book-overlay-container">
                  <motion.div 
                    className="book-overlay-bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => { playBookSfx('close'); setOpenedBook(null); setBookPageIndex(0); }}
                  />
                  
                  {openedBook.trailerId ? (
                    /* Cinema Layout for Screens */
                    <motion.div 
                      layoutId={`screen-container-${openedBook.title}`}
                      className="cinema-layout"
                    >

                      <div className="cinema-stage">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${openedBook.trailerId}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="cinema-info">
                        <div className="cinema-text">
                          <h3>{openedBook.title}</h3>
                          <div className="cinema-meta">
                            <span>{openedBook.subtitle}</span>
                          </div>
                          <p className="cinema-desc">{openedBook.description}</p>
                        </div>
                        <div className="cinema-actions">
                          <a href={openedBook.link} target="_blank" rel="noopener noreferrer" className="read-more-btn" style={{ fontSize: '0.9rem' }}>
                            {openedBook.subtitle === 'Game' ? 'Link' : 'IMDb'} <ExternalLink size={16} style={{ marginLeft: '0.6rem' }}/>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* 3D Book Layout for Pages */
                    <motion.div 
                      layoutId={`book-container-${openedBook.title}`}
                      className="book-container expanded-overlay-3d"
                    >

                      <div className="book-3d-wrapper">
                        {/* 1. Book Body (Pages) */}
                        <div className="book-pages"></div>

                        {/* 2. Hinged Front Cover */}
                        <motion.div 
                          className="book-hinge"
                          style={{ originX: 0 }}
                          initial={{ rotateY: 0 }}
                          animate={{ rotateY: -160 }}
                          exit={{ rotateY: 0 }}
                          transition={{ type: 'spring', stiffness: 100, damping: 20, mass: 1 }}
                        >
                          <div 
                            className="book-cover-front" 
                            style={{ 
                              backgroundImage: `url(${openedBook.coverImageUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundColor: '#e2e8f0',
                            }}
                          ></div>
                          <div className="book-cover-back"></div>
                        </motion.div>

                        {/* 3. Inside Content */}
                        <div className="book-inside-page">
                          <AnimatePresence mode="wait" initial={false}>
                            {bookPageIndex === 0 ? (
                              <motion.div
                                key="desc"
                                initial={{ opacity: 0, rotateY: 90 }}
                                animate={{ opacity: 1, rotateY: 0 }}
                                exit={{ opacity: 0, rotateY: -90 }}
                                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                                className="inside-content"
                                style={{ transformOrigin: 'left center' }}
                              >
                                <h3>{openedBook.title}</h3>
                                <p className="author">{`by ${openedBook.author}`}</p>
                                <p className="desc">{openedBook.description}</p>
                                <div className="read-more-container">
                                  <a href={openedBook.link} target="_blank" rel="noopener noreferrer" className="read-more-btn">
                                    Read More <ExternalLink size={14} style={{ marginLeft: '0.4rem' }}/>
                                  </a>
                                </div>
                                {openedBook.highlights && openedBook.highlights.length > 0 && (
                                  <button
                                    className="page-turn-corner"
                                    onClick={(e) => { e.stopPropagation(); playBookSfx('turn'); setBookPageIndex(1); }}
                                    aria-label="Turn page to highlights"
                                  >
                                    <span className="page-turn-label">Turn page to see my highlights from this book</span>
                                    <span className="page-turn-arrow">→</span>
                                  </button>
                                )}
                              </motion.div>
                            ) : (
                              <motion.div
                                key="highlights"
                                initial={{ opacity: 0, rotateY: 90 }}
                                animate={{ opacity: 1, rotateY: 0 }}
                                exit={{ opacity: 0, rotateY: -90 }}
                                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                                className="inside-content highlights-page"
                                style={{ transformOrigin: 'left center' }}
                              >
                                <div className="highlights-header">
                                  <span className="highlights-label">Highlights</span>
                                  <span className="highlights-count">{openedBook.highlights.length}</span>
                                </div>
                                <ul className="highlights-list">
                                  {openedBook.highlights.map((h, i) => (
                                    <li key={i} className="highlight-item">
                                      <p className="highlight-text">{h.text}</p>
                                      {h.page != null && (
                                        <span className="highlight-page">Page {h.page}</span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                                <button
                                  className="page-turn-btn page-turn-back"
                                  onClick={(e) => { e.stopPropagation(); playBookSfx('turn'); setBookPageIndex(0); }}
                                >
                                  <ChevronLeft size={14} style={{ marginRight: '0.4rem' }}/> Back
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      case 'projects':
        return (
          <div className="section-content">
            <div className="section-head">
              <h2>Experiments</h2>
              <p className="section-description">
                Digital and physical work from the last few years, ranging from building apps and creating community to things I’ve put together in my workshop just for fun.
              </p>
            </div>
            <div className="projects-grid">
              {projectsData.map(project => (
                <motion.div 
                  key={project.id} 
                  className="project-card"
                  whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                  onClick={() => {
                    if(project.expandable) setExpandedProject(project);
                  }}
                  style={{ cursor: project.expandable ? 'pointer' : 'default' }}
                >
                  {(project.image || project.iframe || project.useIconImage) && (
                    <div
                      className={`project-card-image${project.useIconImage ? ' is-icon' : ''}${project.isAppIcon ? ' is-app-icon' : ''}${project.isDarkIcon ? ' is-dark' : ''}${project.isWordmark ? ' is-wordmark' : ''}`}
                      style={{ '--project-color': project.color }}
                    >
                      {project.useIconImage ? (
                        <div
                          className="project-icon-wrapper"
                          style={{ '--project-color': project.color }}
                        >
                          {project.icon}
                        </div>
                      ) : project.iframe ? (
                        <iframe
                          src={project.iframe}
                          title={project.title}
                          style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                          scrolling="no"
                        />
                      ) : (
                        <img src={project.image} alt={project.title} />
                      )}
                      {!project.noOverlay && !project.useIconImage && (
                        <div className="project-card-overlay" style={{ '--project-color': project.color }}></div>
                      )}
                    </div>
                  )}
                  <div className="project-card-content">
                    <div className="project-card-header">
                      <div className="project-meta">
                        <h3>{project.title}</h3>
                        <span className="project-subtitle">{project.subtitle}</span>
                      </div>
                    </div>
                    <div className="project-card-body">
                      <p>{project.description}</p>
                    </div>
                    <div className={`project-card-footer ${project.ctaLabel ? 'cta-centered' : ''}`}>
                      {project.ctaLabel && (
                        <button 
                          className="project-cta-btn" 
                          style={{ '--project-color': project.color }}
                          onClick={() => {
                            if (project.id === 'lightfixtures') {
                              navigate('light-fixtures');
                            }
                          }}
                        >
                          {project.ctaLabel}
                        </button>
                      )}
                      {project.links && project.links.map(link => (
                        <a 
                          key={link.label} 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="project-link"
                        >
                          {link.label} <ExternalLink size={14} />
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'light-fixtures':
        return (
          <div className="section-content">
            <div className="section-head" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
              <button 
                onClick={() => navigate('projects')} 
                className="back-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', padding: 0 }}
              >
                <ChevronLeft size={20} /> Back to Experiments
              </button>
              <h2>Light Fixtures Portfolio</h2>
              <p className="section-description">
                A deeper look into the custom light fixtures and installations I've designed and built.
              </p>
            </div>
            
            <div className="light-fixtures-grid">
              {lightFixturesData.map((fixture, idx) => (
                <motion.div 
                  key={idx} 
                  className={`fixture-hero-card fixture-card-${fixture.title.toLowerCase().replace(/\s+/g, '-')}`} 
                  onClick={() => setSelectedFixture(fixture)}
                  whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                >
                  <div className="fixture-hero-image">
                    <img src={fixture.images[0]} alt={fixture.title} loading="lazy" />
                  </div>
                  <div className="fixture-hero-content">
                    <h3>{fixture.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {selectedFixture && (
                <div className={`fixture-overlay-container ${isMobile ? 'mobile-view' : 'desktop-view'}`}>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixture-overlay-backdrop"
                    onClick={() => setSelectedFixture(null)}
                  />
                  <motion.div 
                    initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
                    animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
                    exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
                    transition={isMobile ? { type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] } : { type: "spring", damping: 25, stiffness: 300 }}
                    className="fixture-overlay-content"
                  >
                    <div className="fixture-overlay-nav">
                      <button className="back-btn-overlay" onClick={() => setSelectedFixture(null)}>
                        {isMobile ? <ChevronLeft size={24} /> : <X size={24} />}
                        {isMobile && <span>Back</span>}
                      </button>
                    </div>
                    
                    <div className="fixture-overlay-header">
                      <h3>{selectedFixture.title}</h3>
                    </div>
                    <div className="fixture-overlay-body">
                      <p className="fixture-description">{selectedFixture.description}</p>
                      <div className="fixture-gallery">
                        {selectedFixture.images.map((img, imgIdx) => (
                          <div key={imgIdx} className="fixture-image-container">
                            <img src={img} alt={`${selectedFixture.title} ${imgIdx + 1}`} loading="lazy" />
                          </div>
                        ))}
                        {selectedFixture.videos && selectedFixture.videos.map((videoId, vidIdx) => (
                          <div key={`vid-${vidIdx}`} className="fixture-image-container fixture-video-container">
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title={`${selectedFixture.title} video ${vidIdx + 1}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      case 'photography':
        return (
          <div className="section-content">
            <div className="section-head">
              <h2>Photography</h2>
              <p className="section-description" style={{ marginBottom: '1.5rem' }}>
                My first real hobby was photography.
              </p>
              <blockquote style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)', fontStyle: 'italic' }}>
                "The camera is an instrument that teaches people how to see without a camera."
                <footer style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>— Dorothea Lange</footer>
              </blockquote>
            </div>
            <div className="photography-stack">
              {photographyData.slice(0, 16).map((photo, i) => (
                <motion.div 
                  key={i} 
                  className="photo-item-container" 
                  onClick={() => setSelectedPhoto(photo)}
                  whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                >
                  <img src={photo.src} alt={photo.alt} />
                </motion.div>
              ))}
              <motion.div 
                className="photo-item-container" 
                onClick={() => setSelectedPhoto(photographyData[16])}
                whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
              >
                <img src={photographyData[16].src} alt={photographyData[16].alt} />
              </motion.div>
              <motion.div 
                className="photo-item-container" 
                onClick={() => setSelectedPhoto(photographyData[17])}
                whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
              >
                <img src={photographyData[17].src} alt={photographyData[17].alt} />

              </motion.div>

              <div style={{ marginTop: '8rem', marginBottom: '0.5rem' }}>
                <p className="section-description">
                These images were taken within a fifteen minute walk from home. Most days begin and end with a walk here. We live in the Fort Scott neighborhood of the Presidio. It is a very beautiful and quiet place.
                </p>
              </div>

              {photographyData.slice(18).map((photo, i) => (
                <motion.div 
                  key={`nature-${i}`} 
                  className="photo-item-container" 
                  onClick={() => setSelectedPhoto(photo)}
                  whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                >
                  <img src={photo.src} alt={photo.alt} />
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="section-content">
            <div className="section-head">
              <h2>Reach Out</h2>
              <p className="section-description">
                I'm always open to new projects, collaborations, or just a friendly chat. 
                Drop me a message below and I'll get back to you as soon as I can.
              </p>
            </div>
            
            <div className="contact-container">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="success-message"
                >
                  <h3>Thank you!</h3>
                  <p>Your message has been sent successfully. I'll get back to you soon.</p>
                  <motion.button 
                    onClick={() => setSubmitted(false)} 
                    className="submit-btn" 
                    style={{ marginTop: '2rem' }}
                    whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                  >
                    Send another message
                  </motion.button>
                </motion.div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" placeholder="Your Name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder="your@email.com" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea name="message" id="message" rows="5" placeholder="What's on your mind?" required></textarea>
                  </div>
                  <motion.button 
                    type="submit" 
                    className="submit-btn"
                    whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                  >
                    Send Message <Send size={18} />
                  </motion.button>
                </form>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`container${isRetroMode ? ' retro-active' : ''}`}>
      {/* Retro entry cover — a full-screen white sheet that mounts at full
          opacity BEFORE the swap into retro mode. Hides the landing→CRT
          transition and the brief teal flash through the DOS flicker, so
          the user only ever sees a clean fade into the running boot screen.
          Driven by setRetroCover from handleLandingSelect and the Shift+P
          handler; fades out once the DOS boot is stable. */}
      <AnimatePresence>
        {retroCover && (
          <motion.div
            key="retro-cover"
            className="retro-cover"
            aria-hidden="true"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
      {/* Landing chooser — only shown on first visit (or after the user
          clears localStorage). Picks between the modern site and the 90s
          retro PC. Choice is persisted; returning visitors skip this. */}
      <AnimatePresence>
        {!siteModeChosen && (
          <motion.div
            key="landing"
            className="landing-root"
            initial={{ opacity: 1 }}
            animate={{ opacity: landingLeaving ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <motion.div
              className="landing-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <h1 className="landing-title">Hi, I'm Boden 👋</h1>
              <p className="landing-lede">
                Thanks for stopping by. You have two choices when it comes to
                experiencing my site. The first, a modern clean version. The
                second, a love letter to the 90s. Pick whichever suits your
                mood. You can always switch later.
              </p>

              <div className="landing-grid">
                {/* Modern */}
                <button
                  type="button"
                  className="landing-card-btn landing-card-btn-modern"
                  onClick={() => handleLandingSelect('modern')}
                  disabled={!!landingLeaving}
                >
                  <div className="landing-card-img">
                    <img
                      src="https://cdn.magicpatterns.com/uploads/jwXcbBUjWC1dTjcitqfWSF/tumblr_593fccb72033970ae12d9b8879f09bb6_75814253_540.png"
                      alt="Modern computer"
                    />
                  </div>
                  <div className="landing-card-row">
                    <span className="landing-card-label">Modern site</span>
                    <span className="landing-card-arrow" aria-hidden="true">→</span>
                  </div>
                  <p className="landing-card-sub">Clean &amp; calm</p>
                </button>

                {/* 90s */}
                <button
                  type="button"
                  className="landing-card-btn landing-card-btn-retro"
                  onClick={() => handleLandingSelect('retro')}
                  disabled={!!landingLeaving}
                >
                  <div className="landing-card-img landing-card-img-retro">
                    <img
                      src="https://cdn.magicpatterns.com/uploads/dvcZrtiRWv8QcYmNDcUhmX/PNG_image.png"
                      alt="Pixel PC"
                    />
                  </div>
                  <div className="landing-card-row">
                    <span className="landing-card-label landing-card-label-retro">
                      Enter the 90s
                    </span>
                    <span className="landing-card-arrow landing-card-arrow-retro" aria-hidden="true">→</span>
                  </div>
                  <p className="landing-card-sub landing-card-sub-retro">
                    Slower, weirder, fun
                  </p>
                </button>
              </div>
            </motion.div>

            {/* Transition overlays — fade for modern, white-flash for retro. */}
            <AnimatePresence>
              {landingLeaving === 'modern' && (
                <motion.div
                  key="modern-fade"
                  className="landing-overlay landing-overlay-modern"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              )}
              {landingLeaving === 'retro' && (
                <motion.div
                  key="retro-flash"
                  className="landing-overlay landing-overlay-retro"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.2, 1] }}
                  transition={{ duration: 0.6, times: [0, 0.15, 0.4, 1] }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {timePhase === 'evening' && <NightSky />}
      {!isMobile && (() => {
        const { label, Icon } = PHASE_META[timePhase];
        return (
          <button
            className="phase-toggle"
            onClick={cyclePhase}
            aria-label={`Current phase: ${label}. Click to cycle to the next phase.`}
          >
            <Icon size={18} strokeWidth={1.5} />
            <span className="phase-toggle__label">{label}</span>
          </button>
        );
      })()}
      {/* "Enter 90s mode" toggle — sits next to the phase toggle. Hidden in
          retro mode (the user is already there) and on mobile (the retro UI
          isn't usable on phones). Dispatches Shift+P so the existing boot
          pipeline runs. */}
      {!isRetroMode && !isMobile && (
        <button
          className="mode-toggle"
          onClick={() => {
            // Invoke the Shift+P handler directly via ref — works from any
            // tab regardless of DOM event routing.
            shiftPHandlerRef.current({ shiftKey: true, key: 'P', repeat: false });
          }}
          aria-label="Enter 90s mode"
          title="Enter 90s mode"
        >
          <span className="mode-toggle__icon" aria-hidden="true" />
          <span className="mode-toggle__label">Enter 90s mode</span>
        </button>
      )}
      {/* Desktop sidebar — left */}
      <nav className="navbar">
        {sections.filter(s => !s.hidden).map(s => (
          <motion.button 
            key={s.id} 
            className={`nav-link ${activeTab === s.id ? 'active' : ''}`}
            onClick={() => navigate(s.id)}
            whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
          >
            {s.label}
          </motion.button>
        ))}
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {sections.filter(s => !s.hidden).map(s => (
              <motion.button
                key={s.id}
                className={`nav-link ${activeTab === s.id ? 'active' : ''}`}
                onClick={() => navigate(s.id)}
                whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
              >
                {s.label}
              </motion.button>
            ))}
            {(() => {
              const { label, Icon } = PHASE_META[timePhase];
              return (
                <button
                  className="phase-toggle phase-toggle--in-drawer"
                  onClick={cyclePhase}
                  aria-label={`Current phase: ${label}. Tap to cycle.`}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  <span className="phase-toggle__label">{label}</span>
                </button>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="content-wrapper">
        <AnimatePresence mode="wait">
          <motion.section 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            {/* Mobile hamburger - inside section to scroll away */}
            <motion.button 
              className="hamburger" 
              onClick={() => setMobileOpen(o => !o)} 
              aria-label="Menu"
              whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
            >
              <span /><span /><span />
            </motion.button>
            {renderSection()}
          </motion.section>
        </AnimatePresence>

        {/* Overlay for expanded product */}
        <AnimatePresence>
          {expandedProduct && (
            <div className="product-overlay-container">
              <motion.div 
                className="product-overlay-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setExpandedProduct(null)}
              />
              <motion.div 
                layoutId={`product-${expandedProduct.name}`}
                className="card product-card expanded-overlay"
              >
                <button className="close-btn" onClick={() => setExpandedProduct(null)} aria-label="Close">
                  <X size={20} />
                </button>
                {expandedProduct.iconUrl && (
                  <img src={expandedProduct.iconUrl} alt={`${expandedProduct.name} icon`} className="product-icon" />
                )}
                <h3 style={{ marginBottom: '1rem' }}>{expandedProduct.name}</h3>
                <div className="expanded-content">
                  <p className="short-desc">{expandedProduct.desc}</p>
                  {expandedProduct.longerDesc && (
                    <p className="longer-desc" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--panel-border)', paddingTop: '1.5rem' }}>
                      {expandedProduct.longerDesc}
                    </p>
                  )}
                  <a 
                    href={expandedProduct.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="visit-button"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.6rem', 
                      marginTop: '2.5rem', 
                      padding: '0.8rem 1.8rem',
                      background: 'var(--accent-blue)',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: '600', 
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Visit <ExternalLink size={18} />
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Overlay for expanded project */}
        <AnimatePresence>
          {expandedProject && (
            <div className="product-overlay-container" style={{ zIndex: 1000 }}>
              <motion.div 
                className="product-overlay-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setExpandedProject(null)}
              />
              <motion.div 
                layoutId={`project-${expandedProject.id}`}
                className="card product-card expanded-overlay"
                style={{
                  maxWidth: '800px',
                  width: '90%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2rem'
                }}
              >
                <button className="close-btn" onClick={() => setExpandedProject(null)} aria-label="Close">
                  <X size={20} />
                </button>
                {(expandedProject.image || expandedProject.iframe) && (
                  <div style={{ width: '100%', height: '300px', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem', position: 'relative', flexShrink: 0 }}>
                    {expandedProject.iframe ? (
                      <iframe 
                        src={expandedProject.iframe} 
                        title={expandedProject.title} 
                        style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                        scrolling="no"
                      />
                    ) : (
                      <img 
                        src={expandedProject.image} 
                        alt={expandedProject.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                )}
                <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: 'bold' }}>{expandedProject.title}</h2>
                <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '1.5rem', fontWeight: '500', fontSize: '1.2rem' }}>
                  {expandedProject.subtitle}
                </span>
                
                <div className="expanded-content" style={{ paddingRight: '1rem' }}>
                  {expandedProject.longerDesc && Array.isArray(expandedProject.longerDesc) ? (
                    expandedProject.longerDesc.map((paragraph, idx) => (
                      <p key={idx} style={{ marginBottom: '1rem', lineHeight: '1.6', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p style={{ lineHeight: '1.6', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{expandedProject.description}</p>
                  )}
                  
                  {expandedProject.links && expandedProject.links.length > 0 && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                      {expandedProject.links.map((link, idx) => (
                        <a 
                          key={idx}
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="visit-button"
                          style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.6rem', 
                            padding: '0.8rem 1.8rem',
                            background: expandedProject.color || 'var(--accent-blue)',
                            color: 'white',
                            borderRadius: '12px',
                            fontWeight: '600', 
                            textDecoration: 'none',
                            transition: 'transform 0.2s ease, opacity 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                          {link.label} <ExternalLink size={18} />
                        </a>
                      ))}
                    </div>
                  )}

                  {expandedProject.iframeDemo && (
                    <div style={{ width: '100%', height: '500px', borderRadius: '12px', overflow: 'hidden', marginTop: '3rem', position: 'relative', flexShrink: 0 }}>
                      <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--text-secondary)', textAlign: 'center' }}>24-Hour Accelerated Demo</h3>
                      <iframe 
                        src={expandedProject.iframeDemo} 
                        title={`${expandedProject.title} Demo`} 
                        style={{ width: '100%', height: 'calc(100% - 2.5rem)', border: 'none', pointerEvents: 'none' }}
                        scrolling="no"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Photography Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.button 
              className="lightbox-close"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={32} />
            </motion.button>
            <motion.div 
              className="lightbox-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button 
                className="lightbox-nav-btn prev" 
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = photographyData.findIndex(p => p.src === selectedPhoto.src);
                  const prevIndex = (currentIndex - 1 + photographyData.length) % photographyData.length;
                  setSelectedPhoto(photographyData[prevIndex]);
                }}
                whileTap={{ scale: 0.9, x: -5, transition: { duration: 0.1 } }}
              >
                <ChevronLeft size={48} strokeWidth={1} />
              </motion.button>
              
              <img src={selectedPhoto.src} alt={selectedPhoto.alt} />
              
              <motion.button 
                className="lightbox-nav-btn next" 
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = photographyData.findIndex(p => p.src === selectedPhoto.src);
                  const nextIndex = (currentIndex + 1) % photographyData.length;
                  setSelectedPhoto(photographyData[nextIndex]);
                }}
                whileTap={{ scale: 0.9, x: 5, transition: { duration: 0.1 } }}
              >
                <ChevronRight size={48} strokeWidth={1} />
              </motion.button>
              
              {selectedPhoto.alt && (
                <div className="lightbox-caption">{selectedPhoto.alt}</div>
              )}
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Modern-site Webamp mount — when the user clicks "launch the Retro WIN
          Media Player" from the Library/Audio page, open the player as a
          floating window pinned to the viewport (no PC boot). When the CRT is
          active, the retro mount inside .crt-win95-desktop handles it instead. */}
      {isWebampOpen && !isRetroMode && (
        <div className="webamp-floating-context">
          <WebampErrorBoundary onError={() => setIsWebampOpen(false)}>
            <Suspense fallback={null}>
              <Webamp
                tracks={webampAssets?.tracks || []}
                skins={webampAssets?.skins || []}
                initialSkin={webampAssets?.initialSkin}
                onClose={() => setIsWebampOpen(false)}
              />
            </Suspense>
          </WebampErrorBoundary>
        </div>
      )}
    </div>
  );
}

export default App;
