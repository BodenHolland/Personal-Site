import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SunCalc from 'suncalc';
import {
  playMouseDown,
  playMouseUp,
  playKeyboard,
  playPowerOn,
  playMonitorClick,
  playShutdown,
  startAmbient,
  stopAmbient,
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
      { text: "The entire enterprise basks in irreality.", page: 74 },
      { text: "The dots, discs, columns, rooms, desert experiments, and city projects that were to follow—all the way to a ground zero, achieved somewhere in the mid-seventies, when Irwin declared that nonobjective art now meant \"nonobject,\" and that perception itself, independent of any object, was the true art act. But another way of seeing those late lines is to realize that they themselves were that ground zero, that in a period of two years Irwin had achieved a complete revolution in his thinking.", page: 84 },
      { text: "You have to make it very clear to anyone who might read your essay, especially any young artist who might happen to pick it up, that my whole process was really an intuitive activity in which all of the time I was only putting one foot in front of the other, and that each step was not that resolved.", page: 89 },
      { text: "What Robert Irwin is insisting upon, these paintings seem irresistibly to declare, is that the medium is not the message. They explore a division, as absolute as can possibly be demonstrated, between the art-object and the art, between painting and the experience of art. What stays in the museum is only the art-object, not valueless, but not the value of art. The art is what has happened to the viewer.", page: 95 },
      { text: "That's a big difference between a West Coast artist and a European. A European artist really believes in himself as part of that historical tradition, that archive. They see themselves as part of the stream of history, and they conduct themselves in that way, with a certain amount of importance and self-esteem and so forth… But the minute I start thinking about making gestures about my historical role, I mean, I can't do it, I have to start laughing, because there's a certain humor in that.", page: 99 },
      { text: "You start out asking questions and following leads, and it gets to be like being a private detective. I'd already had a bit of experience with that working on the frames for the dots. With the discs I don't know how long it took. There were times I'd set out in the morning and spend two or three weeks driving all day long, tracing a lead down, trying to find someone willing to undertake a particular kind of work.", page: 105 },
      { text: "Most of the time I approached them as a store-window decorator. I never approached them as an artist, because that wasn't something they were going to understand—hell, even I didn't understand it—and it only confused matters. It was much better to keep it on a practical level, as if you were going to do a hundred signs in this format.", page: 105 },
      { text: "Each time I had to find something materially, physically, that had the same scale as the questions I was asking.", page: 114 },
      { text: "To me teaching is a really interesting activity, and it's also one of the most precarious activities in the world, because it's such a huge responsibility.", page: 123 },
      { text: "I would think that the most immoral thing one can do is have ambitions for someone else's mind. That's the crux of the challenge and the responsibility of having the opportunity to deal with young people at such a crucial time in their formation. One of the hardest things to do is not to give them clues—Here, do it this way, it's a lot easier—and instead to keep them on the edge of the question.", page: 125 },
      { text: "That's the last thing you can do for them, that's the worst — be their guru. And wherever I've been, once it begins to shift from why to how, I simply know I'm gone.", page: 126 },
      { text: "At that time, I was beginning to think about using energy in my work, as opposed to matter, and that meant dealing with light and sound and other kinds of energy forms. So the idea that I might be able to talk to some physicists, not about hardware or things of that sort, but rather about how they actually thought about those ideas of space and energy and matter, what their approach was to the whole question, their mental picture: that seemed to me to be something really worth doing.", page: 128 },
      { text: "All art is experience, yet all experience is not art. The artist chooses from experience that which he defines as art, possibly because it has not yet been experienced enough, or because it needs to be experienced more.", page: 131 },
      { text: "All art-world distinctions are meaningless.", page: 131 },
      { text: "I think what happens is that in our ordinary lives we move through the world with a strong expectation-fit ratio which we use as much to block out information as to gather it in—and for good reason, most of the time; we block out information which is not critical to our activity.", page: 133 },
      { text: "Irwin, who was fascinated by the ability of the two eyes to integrate their separate perceptions, mastered a technique for separating their focus: \"We taught ourselves by placing a dot on a window and gazing both at and beyond it, thus allowing two planes of focus, one for each eye… I can still do it any time I want. It takes a few minutes' concentration, but I can just separate them, for example, having one eye register foreground and the other background.\"", page: 134 },
      { text: "Reason / individual / intuition / feeling: Reason is the processing of our interface with our own subjective being. Logic / community / intellect / mental: Logic is the processing of our interface with our objective constructs, our social being.", page: 139 },
      { text: "Another word Irwin uses in this context is inquiry. All these researchers in their own ways are engaged in the process of inquiry, and the most salient feature of inquiry is its open-endedness. It is pursued for no reason whatsoever; it is the project of the passionately curious. The wilderness is stalked by explorers without maps and without any particular goals: their principal compass is their reason.", page: 141 },
      { text: "He is quite adamant on the question of whether society owes the artist a living; he feels it does not. He urges young artists to structure their finances in such a way that they do not have to rely on the sale of their art: he urges them to reduce their material requirements and to cultivate alternative sources of income. The important thing, whenever possible, is to safeguard the art from impinging financial pressures. Irwin does not subscribe to the sackcloth-and-ashes school of artistic romanticism; he sees no special virtue in starving in garrets.", page: 142 },
      { text: "Instead of my overlaying my ideas onto that space, that space overlaid itself on me.", page: 154 },
      { text: "I cut the knot. I got rid of the studio, sold all the things I owned, all the equipment, all my stuff; and without knowing what I was going to do with myself or how I was going to spend my time, I simply stopped being an artist in those senses. I just quit.", page: 160 },
      { text: "Whoever you are, go out into the evening, leaving your room, of which you know every bit; your house is the last before the infinite, whoever you are. — Rainer Maria Rilke", page: 161 },
      { text: "Irwin chose to absorb the lessons of the desert and apply them, on a site-by-site basis, to each new room whose presence he would be confronting and trying to modulate during the coming years.", page: 165 },
      { text: "What would be left, Irwin hoped, would be that shiver of perception perceiving itself.", page: 194 },
      { text: "They were going to spend a lot of money to tear down that obsolete spur of freeway, but I suggested that for the same amount of money, they could erect a monument, as it were, to their triumph. I proposed that they extend the supporting buttresses one span beyond the halted freeway, but then, rather than extending the concrete highway to reach that next span, they instead arch the double-decker roadway gently skyward, as if some huge hand had simply come down and peeled the highway back, bringing the whole project to a halt. Which is, in effect, what had happened.", page: 195 },
      { text: "I'm no longer concerned with the art world context. I'll use any materials, any techniques (I don't care if somebody else is using them or seems to have them earmarked; I don't care if they're thought of as art or nonart), anything that references against the specific conditions of the site. Whether it works is my only criterion.", page: 196 },
      { text: "What I'm moving toward in my recent work is something I would call 'site-generated.' The site in its absolute particularity dictates to me the possibilities of response.", page: 199 },
      { text: "Stella projects the ideal of an art that would not allow us 'to avoid the fact that it's supposed to be entirely visual.' It is significant however that Stella does not claim his art succeeds in being entirely visual. What the work of art is, is not what it is supposed to be. Instead of being fully present, it is only a metaphor of presence. No matter how radical the pursuit of presence, the work of art will always fall short of that purer art that is its telos. It points beyond itself and lacks the plenitude it demands. — Karsten Harries", page: 200 },
      { text: "Instead of being fully present, it is only a metaphor of presence. With this phrase, Harries summons the passion of Irwin's career, the ghost he tries to shake. In everything Irwin has done since the abstract expressionist canvases in the late fifties, he has been trying to approach—and slowly getting closer and closer to his goal—that presence that would not be metaphorical.", page: 201 },
      { text: "The piece was gentle enough not to make any issues about its existence. And it was as close as I've been able to get to simple presence. The metaphor, the means were minimal. The intellectual connotation that it was about art was just about as minimal as I've ever gotten it, and yet it still did something. It was integrated and yet active.", page: 202 },
      { text: "The thing to realize is that the reduction was a reduction of imagery to get at physicality, a reduction of metaphor to get at presence. I did it within the painting. I had to restrict my means, because the more complex the painting was, the more it became, for me and other people, metaphor. We had to drain it of metaphor so that we'd see the presence. But, at another level, the presence is always there. You can see it in the most restricted things, but you can see it in the most elaborate things, too, so long as you're attending to it.", page: 203 },
      { text: "Even revolutions don't cause change: change causes revolutions.", page: 204 },
      { text: "Sure he's been scared. He's scared of the prospects of his disappearance as an artist, that what he's doing might get sufficiently far enough from the expectations of artists and fellow inquirers that he disappears. That's of concern to him. But it's of interest as well. And face it: it's real exciting having one foot on a banana peel and the other hanging over the edge of an abyss. — Ed Wortz", page: 205 },
      { text: "In short, he is an artist who one day got hooked on his own curiosity and decided to live it.", page: 206 },
      { text: "He has an extraordinary tolerance for ambiguity: he asks questions that seem by their very nature unanswerable, but he maintains his interest because the questions are legitimate—and are themselves probably more interesting than any answer they might summon.", page: 206 },
      { text: "With food, for instance, people seem able to understand what's involved: you savor the taste rather than just feed the body. But people have a hard time understanding that it should be the same way with visual experience.", page: 215 },
      { text: "No wonder there are so many sensory junkies in this town, no wonder people take drugs. Most people in this city—and it's true of most cities—are simply oblivious to the incredibly rich spectacle of the everyday world; they're missing out on this visual Disneyland happening all around them all the time. All that drugs do—they don't heighten or brighten one's sense of perception—all they do is momentarily override all the habitual inhibitions to clear seeing which we manage to place in our way most of the rest of the time.", page: 216 },
      { text: "Artists need to be in there from the start, making the argument for quality. As opposed to, say, giving the artist one percent afterward—which is, hell, just tokenism to the nth degree.", page: 222 },
      { text: "If you asked me, 'What is your ambition?'—basically, the answer is just to make you a little more aware than you were the day before of how beautiful the world is. This isn't saying that I know what the world should look like. It's not that I'm rebuilding the world. What artists do is to teach you how to exercise your own potential; they always have.", page: 227 },
      { text: "Malevich, Tatlin, Mondrian, de Kooning, Einstein, Watson, Crick… in claiming these masters as his colleagues, he's not so much keying on his own importance as asserting the importance of the continuing dialogue. Irwin's sensibility is immensely playful, but the play is absolutely serious. If he speaks of Einstein and Watson, he's merely insisting that art has both the right and the obligation to stake its claims as high as any science.", page: 233 },
      { text: "You must listen without always wanting to compare with the musical basis you already have… when music for which you have no prepared compartments strikes your ear, what happens? Either the music remains outside you or you force it with all your might into one of those compartments, although it does not fit… and that hurts you and you blame the music. But in reality you are to blame, because you force it into a compartment into which it does not fit, instead of calmly, passively, quietly, and without opposition, helping the music to build a new compartment for itself. — Ernst Toch", page: 234 },
      { text: "Paradoxically, presence itself, immediacy—Irwin's Holy Grail—reveals itself only across time, across the fourth dimension. You have to stop, shut up, and listen if you're ever going to hear.", page: 235 },
      { text: "Here's an artist who tries time and again to nail down beatitude. He wants to take all that bliss, all that serenity, all that wonder, and—damn it—he wants to batten it down. He wants to batten it down tight and then—ppfff, the tulip opening to simply let it go.", page: 236 },
      { text: "Nicolas of Cusa has this wonderful way of talking about the difference between logic and faith—between knowing and truth. Logic, he suggests, is like an n-sided polygon nested inside a circle. The more sides you add, the more the polygon approaches the circle which surrounds it. And yet, the farther away it gets as well. For the circle is but a single, seamless line, whereas your polygon seems to be breeding more and more lines, more and more angles, becoming less and less seamless. No matter how many sides you add, it never reaches the circle, and at a certain point a leap is required, from endlessly compounding multiplicity to singleness of being. Another name for that leap, of course, is grace.", page: 236 },
      { text: "Newly sensitized to the infinitely varied, infinitesimally graduated spectrum of hues and color in nature through his recent intensive work with flowers at the Getty, Irwin now tried to bring a sense of that dazzling variety back inside at the Dia. Disappointed at the surprisingly attenuated range of colors available in standard commercial fluorescent and neon shafts, Irwin resolved to fashion his own by wrapping meticulously selected fluorescent bulbs in layer upon layer of wildly various theatrical gels.", page: 263 },
      { text: "Seeing really is forgetting the name of the thing you see. You walk in and your brain tells you, oh, that's a red, a yellow, and a blue plane—so that that's what you see. You see 'red,' and 'yellow' and 'blue,' and it takes a while for your perceptual apparatus to burn through all that initial cognitive/linguistic labeling.", page: 285 },
      { text: "The point is to get people to peel those visors off their faces, to remove the goggles, to abandon the screens. Those screens whose very purpose is to screen the actual world out. Who cares about virtuality when there's all this reality—this incredible, inexhaustible, insatiable, astonishing reality—present all around!", page: 292 },
      { text: "Philosophy unties knots in our thinking; hence its results must be simple; but philosophizing has to be as complicated as the knots it unties. — Ludwig Wittgenstein, Zettel, #452", page: null }
    ]
  },
  {
    title: "Before Forgiveness",
    author: "David Konstan",
    coverImageUrl: "/book_covers/book2.jpg",
    description: "An exploration into the historical origins of forgiveness, arguing that the modern concept of interpersonal forgiveness was largely absent in the ancient world.",
    link: "https://ndpr.nd.edu/reviews/before-forgiveness-the-origin-of-a-moral-idea/",
    highlights: [
      { text: "Charles Griswold writes, 'To forgive someone… assumes their responsibility for the wrongdoing,' and it occurs in a context in which the wrongdoer and wronged party accept 'the fact that wrong was indeed done, and done (in some sense) voluntarily.' Alice MacLachlan writes, 'the very act of forgiving — however it is expressed — makes a number of claims: that something wrongful was done, that the wrong has caused harm, and that you (the forgiven) are responsible, even culpable, for this harm.' Yet, in accepting this description, we commit ourselves to a view that drives a deep wedge between modern and ancient strategies for overcoming the anger and urge to vengeance that arises as a consequence of wrongdoing.", page: 3 },
      { text: "There are times when we do something unintentionally, not because we are not in our right minds or because we have been forced by others, but simply because we did not know all the information relevant to the case.", page: 5 },
      { text: "Forgiving cannot be forgetting, or 'getting over' anger by any means whatever. — Griswold", page: 6 },
      { text: "Forgiveness is a far deeper and richer phenomenon, involving much more reflection and interaction between forgiver and forgiven. So too, no forgiveness exists in which the ostensibly injured party treats the offense as negligible or unworthy of attention. Such an attitude of aristocratic disdain may manifest itself as indifference to an insult that a lesser person would have resented more deeply; the superior cast of mind of the ancient Stoics, who maintained, with Socrates, that 'a good man cannot be wronged by a bad man.' But this is not forgiveness but the denial that an offense was truly given, as the offender was beneath contempt.", page: 6 },
      { text: "George Herbert Mead writes: 'A person who forgives but does not forget is an unpleasant companion; what goes with forgiving is forgetting, getting rid of the memory of it.'", page: 6 },
      { text: "There is no comparable imperative to confession and repentance in classical accounts of reconciliation or the appeasement of the anger consequent upon a wrongdoing. Correspondingly, the vocabulary of regret, repentance, or a change of mind or attitude (in Greek, metameleia or metanoia; in Latin, paenitentia) is rarely brought into connection with the giving over of anger or with the terms typically, but misleadingly, translated into English as 'forgive.'", page: 11 },
      { text: "As Robert Kaster remarks, the idea of 'a change of heart that leads one to seek purgation and forgiveness' was unknown to pre-Christian Romans. David Winston observes that 'Greek philosophy generally had little interest in the feelings of regret or remorse that may at times lead an individual to a fundamental reassessment of his former life path.'", page: 11 },
      { text: "Aristotle defines anger as a response to a slight or belittlement, and because 'a slight is a voluntary thing,' it follows that people are peaceably disposed 'toward those who do not belittle them, or who do so involuntarily, or who at least seem like that.' Thus, you should try to show that you meant just the opposite, or that however you behaved toward the other person you also behave toward yourself, because people do not normally belittle themselves.", page: 23 },
      { text: "Aristotle says we give over anger toward those who adopt a humble attitude, because this is a sign that they are beneath us and so fear us, and 'no one belittles a person he fears.' Clearly, Aristotle is not so much interested in the sincere expression of regret or remorse, which might elicit forgiveness, as he is in the demonstration that any hint of insult was unintentional, because, by abasing yourself, you openly exhibit your recognition of the other person's superiority.", page: 24 },
      { text: "Wagatsuma and Rosett observe that apologies have different meanings in different cultures. In North America a 'good' apology usually means: 'I have done something wrong. That wrong has caused you harm. I am responsible for the wrong and I caused the harm you have suffered. I accept that responsibility and I feel remorse.' In Japan, however, an apology may mean: 'I willingly submit to your authority. I humble myself to you and ask submissively that you not use your authority to harm me.'", page: 24 },
      { text: "As Aristotle puts it, 'it is impossible to be afraid and be angry at the same time' — the point being that if you are afraid, you have already acknowledged your inferior status, and so have no grounds on which to resent the insult.", page: 25 },
      { text: "Aristotle's discussion of involuntary action in the case of ignorance is equally nuanced. If one commits a wrong in ignorance but later feels no regret, then the act hardly counts as unwilling, because one would have done it even had one been fully aware; Aristotle labels such an act 'not voluntary,' as opposed to 'involuntary.'", page: 27 }
    ]
  },
  {
    title: "The Cambridge Companion to Hannah Arendt",
    author: "Dana Villa",
    coverImageUrl: "/book_covers/arendt_new_cover.jpg",
    description: "This volume examines the primary themes of Hannah Arendt's multi-faceted work, providing a comprehensive overview of her political and philosophical thought.",
    link: "https://www.goodreads.com/en/book/show/127243",
    highlights: [
      { text: "Arendt views the notions of a 'people,' 'nation,' and 'state' as somehow co-original: no single term of this triad can exist without the other two. A people is active, while the mob is passive or reactive. 'The mob,' Arendt writes, 'cannot make decisions'; it can only 'acclaim' or 'stone' the objects of its passions.", page: null },
      { text: "She is a pearl diver whose aim is not to resuscitate the past or renew extinct ages, but to introduce crystallizations of rare beauty and profundity into the lives we share with each other.", page: 163 },
      { text: "The more she plumbed the depths of the Western tradition of political thought, the more she became convinced that the 'anti-politics' expressed in Marx's thought had roots which reached as far back as Plato and Aristotle. It was at the very beginning of the Western tradition of political thought that a conceptual framework hostile to popular participation, human diversity (what Arendt dubs 'plurality'), and the open-ended debate between equals had been laid down.", page: 7 },
      { text: "She turns to the Greeks, and to Athens in particular, for the simple reason that the first flowering of democracy was among the most vivid and intense. Athenian political life was a politics of talk and opinion, one which gave a central place to human plurality and the equality between citizens.", page: 9 },
      { text: "Arendt's experience of totalitarianism led her to place a very strong emphasis upon the importance of worldly institutions and legal frameworks. These provide an arena for, but also limits to, the energies of political action and participation. She knows all too well that 'permanent revolution' is the most destructive and futile form of politics there is.", page: 14 },
      { text: "Arendt consistently praised the capacity for independent thought and judgment — even when it threatened to dissolve the moral verities of a culture or put the judging individual at odds not only with the majority, but with the 'moral taste' of his or her epoch. Socrates is her 'model' thinker, whose capacity to undermine custom and convention leads to an enhancement of moral judgment.", page: 18 },
      { text: "'Might the problem of good and evil, our faculty for telling right from wrong, be connected with our faculty of thought? Could the activity of thinking as such, the habit of examining whatever happens to come to pass or attract attention, regardless of results and specific contents, could this activity be among the conditions that make men abstain from evildoing or even actually condition them against it?'", page: 72 },
      { text: "Arendt describes mutual respect as 'a kind of friendship without intimacy and without closeness; it is a regard for the person from the distance which the space of the world puts between us.'", page: 81 },
      { text: "'Imagination alone enables us to see things in their proper perspective, to put that which is too close at a certain distance so that we can see and understand it without bias and prejudice, to bridge abysses of remoteness until we can see and understand everything that is too far away from us as though it were our own affair. This distancing of some things and bridging the abysses to others is part of the dialogue of understanding.'", page: 247 },
      { text: "'Political thought is representative. I form an opinion by considering a given issue from different viewpoints, by making present to my mind the standpoints of those who are absent; that is, I represent them. This process of representation does not blindly adopt the actual views of those who stand somewhere else, and hence look upon the world from a different perspective; this is a question neither of empathy nor of counting noses and joining a majority, but of being and thinking in my own identity where actually I am not. The more people's standpoints I have present in my mind while I am pondering a given issue, and the better I can imagine how I would feel and think if I were in their place, the stronger will be my capacity for representative thinking and the more valid my final conclusions, my opinion.'", page: 254 },
      { text: "In matters of opinion, but not in matters of truth, 'our thinking is truly discursive, running, as it were, from place to place, from one part of the world to another, through all kinds of conflicting views, until it finally ascends from these particularities to some impartial generality.' In this respect one is never alone while forming an opinion.", page: 254 },
      { text: "Truth belongs to the realm of cognition, the realm of logic, mathematics and the strict sciences, and carries always an element of coercion, since it precludes debate and must be accepted by every individual in possession of her rational faculties. Set against the plurality of opinions, truth has a despotic character: it compels universal assent, leaves the mind little freedom of movement, eliminates the diversity of views and reduces the richness of human discourse.", page: 255 },
      { text: "Socrates is aware that anything we think we know might be wrong, and that we come to realize this when we expose our ideas to the scrutiny of others. The corollary of this position, however, is that in every opinion, some truth resides.", page: 265 },
      { text: "Socrates' teaching meant: only he who knows how to live with himself is fit to live with others. The self is the only person from whom I cannot depart, whom I cannot leave, with whom I am welded together.", page: 266 },
      { text: "Aristotle concludes that it is friendship not justice that appears to be the bond of communities. For Aristotle, friendship is higher than justice, because justice is no longer necessary between friends.", page: 267 },
      { text: "'A community is not made out of equals, but on the contrary of people who are different and unequal,' and who therefore rely on the exchange of opinion in friendship to 'equalize' themselves.", page: 267 },
      { text: "Plato, who sees truth as absolute and singular, regards with 'indifference and contempt the world of the city,' and so considers not 'how philosophy looks from the viewpoint of politics but how politics, the realm of human affairs, looks from the viewpoint of philosophy.'", page: 268 },
      { text: "This kind of understanding — seeing the world from the other fellow's point of view — is the political insight par excellence. If we wanted to define the one outstanding virtue of the statesman, we could say that it consists in understanding the greatest possible number and variety of realities — not of subjective viewpoints, but of those realities as they open themselves up to the various opinions of citizens; and, at the same time, in being able to communicate between the citizens and their opinions so that the commonness of this world becomes apparent.", page: 268 },
      { text: "For her, the supreme value of politics is freedom, and freedom in Arendt's sense depends on plurality, spontaneity, and the open-ended, unpredictable character of interaction through speech and deed.", page: 271 },
      { text: "A political act is above all a performance, and, as in music or dance, as opposed to the creative arts, 'the accomplishment lies in the performance itself and not in an end which outlasts the activity.' As a performance, a political act is intended to be distinctive, and so requires for its full appearance the shining brightness we once called glory — that is, fame, which is a form of opinion.", page: 271 },
      { text: "As Oedipus and Hamlet know, and as Friedrich Nietzsche argues, limitless inquiry can prove corrosive when the examined life turns out not to be worth living.", page: 273 },
      { text: "When the tension between common sense and the wonder at being is destroyed, we enter the bleak realm of the 'social,' of programmed life and scripted, poll-tested politics. In this Kafkaesque world, the suspension of what was once common sense is itself common, and hence uncannily banal.", page: 273 },
      { text: "If knowledge (in the modern sense of know-how) and thought have parted company for good, then we would indeed become the helpless slaves, not so much of our machines as of our know-how, thoughtless creatures at the mercy of every gadget which is technically possible, no matter how murderous it is.", page: 282 },
      { text: "Thinking is the faculty by which we ask unanswerable questions, but questions that we can not help asking. It is the faculty by which we seek to understand the meaning of whatever we encounter. And in the quest for meaning there is (and can be) no finality.", page: 283 },
      { text: "By posing the unanswerable questions of meaning, men establish themselves as question-asking beings. Behind all the cognitive questions for which men find answers, there lurk the unanswerable ones that seem entirely idle and have always been denounced as such. It is more than likely that men, if they were ever to lose the appetite for meaning we call thinking and cease to ask unanswerable questions, would lose not only the ability to produce those thought-things that we call works of art but also the capacity to ask all the answerable questions upon which every civilization is founded.", page: 284 },
      { text: "Unless one 'stops and thinks,' unless one develops the capacity to 'think from the standpoint of somebody else,' then it becomes all too easy to succumb to evil. Like Socrates' daimon, thinking may not tell us what we ought to do, but it may prevent us from tolerating or becoming indifferent to evil deeds.", page: 285 },
      { text: "It was the inability to think that Arendt claimed was the most distinctive character trait of Eichmann. 'He was genuinely incapable of uttering a single sentence that was not a cliché' — clichés that protected him from a sense of reality, and sense of what he was doing. 'The longer one listened to him, the more obvious it became that his inability to speak was closely connected with an inability to think, namely, to think from the standpoint of somebody else. No communication was possible with him, not because he lied but because he was surrounded by the most reliable of all safeguards against words and the presence of others, and hence from reality as such.'", page: 286 }
    ]
  },
  {
    title: "A General Theory of Love",
    author: "Thomas Lewis, Fari Amini, and Richard Lannon",
    coverImageUrl: "/book_covers/book4.jpg",
    description: "This original and lucid account draws on latest scientific research to show how our nervous systems are not self-contained, but linked with those around us.",
    link: "https://www.goodreads.com/en/book/show/35711",
    highlights: [
      { text: "Oscar Wilde's Miss Prism says in The Importance of Being Earnest, 'Memory, my dear Cecily, is the diary that we all carry about with us.' Sharp Cecily replies, 'Yes, but it usually chronicles the things that have never happened, and couldn't possibly have happened.'", page: 104 },
      { text: "Behind the familiar bright, analytic engine of consciousness is a shadow of silent strength, spinning dazzlingly complicated life into automatic actions, convictions without intellect, and hunches whose reasons follow later or not at all. It is this darker system that guides our choices in love.", page: 112 },
      { text: "People rely on intelligence to solve problems, and they are naturally baffled when comprehension proves impotent to effect emotional change. To the neocortical brain, rich in the power of abstractions, understanding makes all the difference, but it doesn't count for much in the neural systems that evolved before understanding existed. Ideas bounce like so many peas off the sturdy incomprehension of the limbic and reptilian brains. The dogged implicitness of emotional knowledge, its relentless unreasoning force, prevents logic from granting salvation just as it precludes self-help books from helping.", page: 118 },
      { text: "Gleeful people automatically remember happy times, while a depressed person effortlessly recalls incidents of loss, desertion, and despair. Anxious people dwell on past threats; paranoia instills a retrospective preoccupation with situations of persecution. If an emotion is sufficiently powerful, it can quash opposing networks so completely that their content becomes inaccessible — blotting out discordant sections of the past.", page: 130 },
      { text: "Because human beings remember with neurons, we are disposed to see more of what we have already seen, hear anew what we have heard most often, think just what we have always thought. Our minds are burdened by an informational inertia whose headlong course is not easy to slow. As a life lengthens, momentum gathers.", page: 141 },
      { text: "Who we are and who we become depends, in part, on whom we love.", page: 144 },
      { text: "The more often you do or think or imagine a thing, the more probable it is that your mind will revisit its prior stopping point. When the circuits are sufficiently well worn such that thoughts fly down them with little friction or resistance, that mental path has become a part of you — it is now a habit of speech, thought, action, attitude. Long-standing togetherness writes permanent changes into a brain's open book.", page: 144 },
      { text: "A person cannot know himself until another knows him.", page: 156 },
      { text: "If a parent loves him in the healthiest way, wherein his needs are paramount, mistakes are forgiven, patience is plentiful, and hurts are soothed as best they can be, then that is how he will relate to himself and others. Anomalous love — one where his needs don't matter, or where love is suffocating or autonomy intolerable — makes its ineradicable limbic stamp. Healthy loving then becomes incomprehensible.", page: 160 },
      { text: "A relationship that strays from one's prototype is limbically equivalent to isolation. Loneliness outweighs most pain. These two facts collude to produce one of love's common and initially baffling quirks: most people will choose misery with a partner their limbic brain recognizes over the stagnant pleasure of a 'nice' relationship with someone their attachment mechanisms cannot detect.", page: 161 },
      { text: "When people are hurting and out of balance, they turn to regulating affiliations: groups, clubs, pets, marriages, friendships, masseuses, chiropractors, the Internet. All carry at least the potential for emotional connection. Together, those bonds do more good than all the psychotherapists on the planet.", page: 171 },
      { text: "Self-help books are like car repair manuals: you can read them all day, but doing so doesn't fix a thing. Overhauling emotional knowledge is no spectator sport; it demands the messy experience of yanking and tinkering that comes from a limbic bond. When a limbic connection has established a neural pattern, it takes a limbic connection to revise it.", page: 177 },
      { text: "It is difficult to get the news from poems yet men die miserably every day for lack of what is found there. — William Carlos Williams", page: 191 },
      { text: "Jean Giraudoux: 'If two people who love each other let a single instant wedge itself between them, it grows — it becomes a month, a year, a century; it becomes too late.'", page: 205 },
      { text: "Americans spur one another to accomplish and acquire before anything else — our national dream holds that industry leads to a promised land, and nobody wants to miss out on a share of paradise. When consummating a career does not bring happiness — as it cannot — few pause to reconsider their assumptions; most redouble their efforts. The faster they spin the occupational centrifuge, the more its high-velocity whine drowns out the wiser whisper of their own hearts.", page: 206 },
      { text: "Our culture fawns over the fleetingness of being in love while discounting the importance of loving.", page: 206 },
      { text: "Loving is limbically distinct from in love. Loving is mutuality; loving is synchronous attunement and modulation. As such, adult love depends critically upon knowing the other. In love demands only the brief acquaintance necessary to establish an emotional genre but does not demand that the book of the beloved's soul be perused from preface to epilogue. Loving derives from intimacy, the prolonged and detailed surveillance of a foreign soul.", page: 207 },
      { text: "When somebody loses his partner and says a part of him is gone, he is more right than he thinks. A portion of his neural activity depends on the presence of that other living brain. Without it, the electric interplay that makes up him has changed. Lovers hold keys to each other's identities, and they write neurostructural alterations into each other's networks. Their limbic tie allows each to influence who the other is and becomes.", page: 208 },
      { text: "Love cannot be extracted, commanded, demanded, or wheedled. It can only be given.", page: 209 },
      { text: "'Fathers and teachers,' wrote Dostoyevsky, 'I ponder the question, What is Hell? I maintain it is the suffering of being unable to love.'", page: 204 }
    ]
  },
  {
    title: "No Rules Rules",
    author: "Reed Hastings and Erin Meyer",
    coverImageUrl: "/book_covers/book5.jpg",
    description: "Netflix co-founder Reed Hastings and professor Erin Meyer explore the controversial management philosophy and culture of freedom and responsibility that powered Netflix's success.",
    link: "https://www.norulesrules.com/",
    highlights: [
      { text: "Netflix assumes that you have amazing judgment. And judgment is the solution for almost every ambiguous problem. Not process.", page: 255 },
      { text: "If you have a team of five stunning employees and two adequate ones, the adequate ones will sap managers' energy, so they have less time for the top performers, reduce the quality of group discussions, lowering the team's overall IQ, force others to develop ways to work around them, reducing efficiency, drive staff who seek excellence to quit, and show the team you accept mediocrity, thus multiplying the problem.", page: 395 },
      { text: "Whenever someone came to me to complain about another employee, I would ask, 'What did that person say when you spoke to him about this directly?' This is pretty radical. In most situations, both social and professional, people who consistently say what they really think are quickly isolated, even banished. But at Netflix, we embrace them.", page: 513 },
      { text: "Despite the blissful benefits of praise, by a roughly three-to-one margin, people believe corrective feedback does more to improve their performance than positive feedback.", page: 611 },
      { text: "Feedback helps us to avoid misunderstandings, creates a climate of co-accountability, and reduces the need for hierarchy and rules.", page: 635 },
      { text: "You must show the employee that it's safe to give feedback by responding to all criticism with gratitude and, above all, by providing 'belonging cues.' A belonging cue might be a small gesture, like using an appreciative tone of voice, moving physically closer to the speaker, or looking positively into that person's eyes. Or it might be larger, like thanking that person for their courage and speaking about that courage in front of the larger team.", page: 658 },
      { text: "AIM TO ASSIST: Feedback must be given with positive intent. ACTIONABLE: Your feedback must focus on what the recipient can do differently.", page: 757 },
      { text: "You are required to listen and consider all feedback provided. You are not required to follow it. Say 'thank you' with sincerity. But both you and the provider must understand that the decision to react to the feedback is entirely up to the recipient.", page: 772 },
      { text: "It doesn't matter how brilliant your jerk is, if you keep him on the team you can't benefit from candor. The cost of jerkiness to effective teamwork is too high. Jerks are likely to rip your organization apart from the inside.", page: 824 },
      { text: "When it comes to how we judge performance at Netflix, hard work is irrelevant.", page: 898 },
      { text: "If you want to remove the vacation policy in your organization, lead by example. The practices modeled by the boss will be critical to guide employees as to the appropriate behavior. An office with no vacation policy but a boss who never vacations will result in an office that never vacations.", page: 1370 },
      { text: "'I have no idea why I was offered a contract with a bonus in it because I promise you I will not work any harder or any less hard in any year, in any day because someone is going to pay me more or less.' Any executive worth her paycheck would say the same. Contingent pay works for routine tasks but actually decreases performance for creative work.", page: 1560 },
      { text: "Creative work requires that your mind feel a level of freedom. If part of what you focus on is whether or not your performance will get you that big check, you are not in that open cognitive space where the best ideas and most innovative possibilities reside. You do worse.", page: 1579 },
      { text: "There is no better way to build trust quickly than to shine a light directly on a would-be secret.", page: 1887 },
      { text: "Spinning the truth is one of the most common ways leaders erode trust. Your people are not stupid. When you try to spin them, they see it, and it makes you look like a fraud. Speak plainly, without trying to make bad situations seem good, and your employees will learn you tell the truth.", page: 2152 },
      { text: "A leader who has demonstrated competence and is liked by her team will build trust and prompt risk-taking when she widely sunshines her own mistakes. The one exception is for a leader considered unproven or untrusted. In these cases you'll want to build trust in your competency before shouting your mistakes.", page: 2253 },
      { text: "DON'T SEEK TO PLEASE YOUR BOSS. SEEK TO DO WHAT IS BEST FOR THE COMPANY.", page: 2305 },
      { text: "If your employees are excellent and you give them freedom to implement the bright ideas they believe in, innovation will happen.", page: 2413 },
      { text: "The more you actively farm for dissent, and the more you encourage a culture of expressing disagreement openly, the better the decisions that will be made in your company.", page: 2543 },
      { text: "Farm for dissent. Socialize the idea. Test it out. This sounds a lot like consensus building, but it's not. With consensus building the group decides; at Netflix a person will reach out to relevant colleagues, but does not need to get anyone's agreement before moving forward. For each important decision there is always a clear informed captain. That person has full decision-making freedom.", page: 2626 },
      { text: "How you celebrate is up to you. The one thing you must do is show, ideally in public, that you are pleased she went ahead despite your doubts and offer a clear 'You were right! I was wrong!' to show all employees it's okay to buck the opinion of the boss.", page: 2676 },
      { text: "When a bet fails, the manager must be careful to express interest in the takeaways but no condemnation. If you make a bet and it fails, it's important to speak openly and frequently about what happened. It's critical that your employees are continually hearing about the failed bets of others, so that they are encouraged to take bets themselves.", page: 2729 },
      { text: "During your next one-to-one with your boss ask the following question: 'IF I WERE THINKING OF LEAVING, HOW HARD WOULD YOU WORK TO CHANGE MY MIND?' When you get the answer, you'll know exactly where you stand.", page: 3099 },
      { text: "When you realize you need to let someone go, instead of putting him on some type of PIP, which is humiliating and organizationally costly, take all that money and give it to the employee in the form of a generous severance payment.", page: 3183 },
      { text: "Performance reviews are not the best mechanism for a candid work environment, primarily because the feedback usually goes only one way (down) and comes from only one person (the boss).", page: 3453 },
      { text: "Leading with context, on the other hand, is more difficult, but gives considerably more freedom to employees. You provide all of the information you can so that your team members make great decisions and accomplish their work without oversight or process controlling their actions.", page: 3519 },
      { text: "If loose coupling is to work effectively, with big decisions made at the individual level, then the boss and the employees must be in lockstep agreement on their destination.", page: 3648 },
      { text: "WHEN ONE OF YOUR PEOPLE DOES SOMETHING DUMB DON'T BLAME THEM. INSTEAD ASK YOURSELF WHAT CONTEXT YOU FAILED TO SET. ARE YOU ARTICULATE AND INSPIRING ENOUGH IN EXPRESSING YOUR GOALS AND STRATEGY? HAVE YOU CLEARLY EXPLAINED ALL THE ASSUMPTIONS AND RISKS THAT WILL HELP YOUR TEAM TO MAKE GOOD DECISIONS?", page: 3693 },
      { text: "The overarching lesson we've learned is that — no matter where you come from — when it comes to working across cultural differences, talk, talk, talk.", page: 4235 },
      { text: "The 4As are as follows: Aim to assist. Actionable. Appreciate. Accept or decline.", page: 4291 }
    ]
  },
  {
    title: "Butter Honey Pig Bread",
    author: "Francesca Ekwuyasi",
    coverImageUrl: "/book_covers/book6.jpg",
    description: "An interwoven multi-generational saga of three Nigerian women, examining the choices they make and the fractures that occur when family secrets are revealed.",
    link: "https://www.goodreads.com/en/book/show/51168133",
    highlights: [
      { text: "She sang with an abandon she typically reserved for her vices.", page: 2030 },
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
      { text: "For Tanizaki a museum piece is no cause for rejoicing. An art must live as a part of our daily lives or we had better give it up. We can admire it for what it once was, and try to understand what made it so — as Tanizaki does in In Praise of Shadows — but to pretend that we can still participate in it is mere posturing.", page: 48 },
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
      { text: "To disdain rhetorical rules, to speak one's thoughts in a random manner, without proper emphasis or appropriate passion, was considered demeaning to the audience's intelligence and suggestive of falsehood.", page: 22 },
      { text: "A major new medium changes the structure of discourse; it does so by encouraging certain uses of the intellect, by favoring certain definitions of intelligence and wisdom, and by demanding a certain kind of content — in a phrase, by creating new forms of truth-telling.", page: 27 },
      { text: "Typography fostered the modern idea of individuality, but it destroyed the medieval sense of community and integration. Typography created prose but made poetry into an exotic and elitist form of expression. Typography made modern science possible but transformed religious sensibility into mere superstition. Typography assisted in the growth of the nation-state but thereby made patriotism into a sordid if not lethal emotion.", page: 29 },
      { text: "Think of Richard Nixon or Jimmy Carter or Billy Graham, or even Albert Einstein, and what will come to your mind is an image, a picture of a face, most likely a face on a television screen. Of words, almost nothing will come to mind. This is the difference between thinking in a word-centered culture and thinking in an image-centered culture.", page: 61 },
      { text: "Exposition is a mode of thought, a method of learning, and a means of expression. Almost all of the characteristics we associate with mature discourse were amplified by typography: a sophisticated ability to think conceptually, deductively and sequentially; a high valuation of reason and order; an abhorrence of contradiction; a large capacity for detachment and objectivity; and a tolerance for delayed response. Toward the end of the nineteenth century, the Age of Exposition began to pass. Its replacement was to be the Age of Show Business.", page: 63 },
      { text: "We have here a great loop of impotence: The news elicits from you a variety of opinions about which you can do nothing except to offer them as more news, about which you can do nothing.", page: 69 },
      { text: "To the telegraph, intelligence meant knowing of lots of things, not knowing about them.", page: 70 },
      { text: "The crossword puzzle became a popular form of diversion in America at just that point when the telegraph and the photograph had achieved the transformation of news from functional information to decontextualized fact. This coincidence suggests that the new technologies had turned the age-old problem of information on its head: where people once sought information to manage the real contexts of their lives, now they had to invent contexts in which otherwise useless information might be put to some apparent use.", page: 76 },
      { text: "There is no more disturbing consequence of the electronic and graphic revolution than this: that the world as given to us through television seems natural, not bizarre.", page: 79 },
      { text: "Embedded in the surrealistic frame of a television news show is a theory of anticommunication, featuring a type of discourse that abandons logic, reason, sequence and rules of contradiction. In aesthetics, the name given to this theory is Dadaism; in philosophy, nihilism; in psychiatry, schizophrenia. In the parlance of the theater, it is known as vaudeville.", page: 105 },
      { text: "Disinformation does not mean false information. It means misleading information — misplaced, irrelevant, fragmented or superficial information — information that creates the illusion of knowing something but which in fact leads one away from knowing. When news is packaged as entertainment, that is the inevitable result.", page: 107 },
      { text: "Huxley grasped, as Orwell did not, that it is not necessary to conceal anything from a public insensible to contradiction and narcoticized by technological diversions. 'Television is the soma of Aldous Huxley's Brave New World.' Big Brother turns out to be Howdy Doody.", page: 111 },
      { text: "The spectacle we find in true religions has as its purpose enchantment, not entertainment. The distinction is critical. By endowing things with magic, enchantment is the means through which we may gain access to sacredness. Entertainment is the means through which we distance ourselves from it.", page: 122 },
      { text: "The television commercial is not at all about the character of products to be consumed. It is about the character of the consumers of products.", page: 128 },
      { text: "What the advertiser needs to know is not what is right about the product but what is wrong about the buyer. The television commercial has oriented business away from making products of value and toward making consumers feel valuable, which means that the business of business has now become pseudotherapy.", page: 128 },
      { text: "The Founding Fathers did not foresee that tyranny by government might be superseded by another sort of problem altogether, namely, the corporate state, which through television now controls the flow of public discourse in America.", page: 139 },
      { text: "Television does not ban books, it simply displaces them.", page: 141 },
      { text: "Tyrants of all varieties have always known about the value of providing the masses with amusements as a means of pacifying discontent. But most of them could not have even hoped for a situation in which the masses would ignore that which does not amuse.", page: 141 },
      { text: "Television-teaching always takes the form of storytelling, conducted through dynamic images and supported by music.", page: 148 },
      { text: "An Orwellian world is much easier to recognize, and to oppose, than a Huxleyan. Everything in our background has prepared us to know and resist a prison when the gates begin to close around us. But what if there are no cries of anguish to be heard? Who is prepared to take arms against a sea of amusements? To whom do we complain, and when, and in what tone of voice, when serious discourse dissolves into giggles? What is the antidote to a culture's being drained by laughter?", page: 156 },
      { text: "What is happening in America comes as the unintended consequence of a dramatic change in our modes of public conversation. But it is an ideology nonetheless, for it imposes a way of life, a set of relations among people and ideas, about which there has been no consensus, no discussion and no opposition. Only compliance. Public consciousness has not yet assimilated the point that technology is ideology.", page: 157 },
      { text: "Television, as I have implied earlier, serves us most usefully when presenting junk-entertainment; it serves us most ill when it co-opts serious modes of discourse — news, politics, science, education, commerce, religion — and turns them into entertainment packages. We would all be better off if television got worse, not better.", page: 159 },
      { text: "He believed with H. G. Wells that we are in a race between education and disaster. What afflicted the people in Brave New World was not that they were laughing instead of thinking, but that they did not know what they were laughing about and why they had stopped thinking.", page: 163 },
      { text: "To be unaware that a technology comes equipped with a program for social change, to maintain that technology is neutral, to make the assumption that technology is always a friend to culture is, at this late hour, stupidity plain and simple.", page: null }
    ]
  },
  {
    title: "Community",
    author: "Peter Block",
    coverImageUrl: "/book_covers/book9.jpg",
    description: "Peter Block outlines how to build strong communities by shifting the focus from problems and leaders to the power of citizen engagement and communal accountability.",
    link: "https://www.goodreads.com/en/book/show/2774428",
    highlights: [
      { text: "To create a more positive and connected future for our communities, we must be willing to trade their problems for their possibilities. This trade is what is necessary to create a future for our cities and neighborhoods, organizations and institutions — a future that is distinct from the past. Which is the point.", page: 4 },
      { text: "Individual transformation is the more popular conversation, and the choice not to focus on it is because we have already learned that the transformation of large numbers of individuals does not result in the transformation of communities. If we continue to invest in individuals as the primary target of change, we will spend our primary energy on this and never fully invest in communities. In this way, individual transformation comes at the cost of community.", page: 5 },
      { text: "As Putnam and Feldstein put it: 'A society that has only bonding social capital will be segregated into mutually hostile camps. So a pluralistic democracy requires lots of bridging social capital, not just the bonding variety.'", page: 18 },
      { text: "The most important contribution of these principles is the idea that the way we bring people together matters more than our usual concerns about the content of what we present to people. How we structure the gathering is as worthy of attention as grasping the nature of a problem or focusing on the solutions that we seek.", page: 25 },
      { text: "Conversations that focus on stories about the past become a limitation to community; ones that are teaching parables and focus on the future restore community.", page: 29 },
      { text: "We are a community of possibilities, not a community of problems. Community exists for the sake of belonging and takes its identity from the gifts, generosity, and accountability of its citizens. It is not defined by its fears, its isolation, or its penchant for retribution. We currently have all the capacity, expertise, programs, leaders, regulations, and wealth required to end unnecessary suffering and create an alternative future.", page: 30 },
      { text: "The effect of buying in to this romanticized view of leadership is that it lets citizens off the hook and breeds citizen dependency and entitlement. It undermines a culture where each is accountable for their community. The attention on the leader makes good copy, it gives us someone to blame and thereby declares our innocence, but it does not contribute to building community.", page: 41 },
      { text: "Restorative community is created when we allow ourselves to use the language of healing and relatedness and belonging without embarrassment. It recognizes that taking responsibility for one's own part in creating the present situation is the critical act of courage and engagement, which is the axis around which the future rotates. The essence of restorative community building is not economic prosperity or the political discourse or the capacity of leadership; it is citizens' willingness to own up to their contribution, to be humble, to choose accountability, and to have faith in their own capacity to make authentic promises to create the alternative future.", page: 48 },
      { text: "A citizen is one who is willing to do the following: Hold oneself accountable for the well-being of the larger collective of which we are a part. Choose to own and exercise power rather than defer or delegate it to others. Enter into a collective possibility that gives hospitable and restorative community its own sense of being. Acknowledge that community grows out of the possibility of citizens. Attend to the gifts and capacities of all others, and act to bring the gifts of those on the margin into the center.", page: 65 },
      { text: "A great question has three qualities: It is ambiguous. There is no attempt to try to precisely define what is meant by the question. This requires each person to bring their own, personal meaning into the room. It is personal. All passion, commitment, and connection grow out of what is most personal. We need to create space for the personal. It evokes anxiety. All that matters makes us anxious. It is our wish to escape from anxiety that steals our aliveness. If there is no edge to the question, there is no power.", page: 106 },
      { text: "We need to tell people not to be helpful. Trying to be helpful and giving advice are really ways to control others. Advice is a conversation stopper. In community building, we want to substitute curiosity for advice.", page: 109 }
    ]
  },
  {
    title: "The Book of Disquiet",
    author: "Fernando Pessoa",
    coverImageUrl: "/book_covers/book10.jpg",
    description: "A 'factless autobiography' by Portuguese poet Fernando Pessoa, full of melancholic and philosophical reflections on life and existence.",
    link: "https://www.penguinrandomhouse.com/books/286380/the-book-of-disquiet-by-fernando-pessoa-edited-and-translated-by-richard-zenith/",
    highlights: [
      { text: "I'm astounded whenever I finish something. Astounded and distressed. My perfectionist instinct should inhibit me from finishing; it should inhibit me from even beginning. But I get distracted and start doing something. What I achieve is not the product of an act of my will but of my will's surrender. I begin because I don't have the strength to think; I finish because I don't have the courage to quit. This book is my cowardice.", page: 65 },
      { text: "Each of us is several, is many, is a profusion of selves. So that the self who disdains his surroundings is not the same as the self who suffers or takes joy in them. In the vast colony of our being there are many species of people who think and feel in different ways.", page: 106 },
      { text: "It was existential concerns — operating on both a general and personal level — that subverted the initial project of The Book of Disquiet. On a general level, since The Book's author belonged 'to a generation that inherited disbelief in the Christian faith and created in itself a disbelief in all other faiths.' And since 'we were left, each man to himself, in the desolation of feeling ourselves live', the generational sense of lostness quickly became a personal struggle for identity and meaning.", page: 201 },
      { text: "The semi-fiction called Soares is an implied model for whoever has difficulty adapting to real, normal, everyday life. The only way to survive in this world is by keeping alive our dream, without ever fulfilling it, since the fulfilment never measures up to what we imagine — this was the closest thing to a message that Pessoa left.", page: 348 },
      { text: "To dream one's life and to live one's dreams, feeling what's dreamed and what's lived with an intensity so extreme it makes the distinction between the two meaningless — this credo echoed in nearly every reach of Pessoa's universe, but Soares was its most practical example.", page: 358 },
      { text: "Night will fall on us all and the coach will pull up. I enjoy the breeze I'm given and the soul I was given to enjoy it with, and I no longer question or seek. If what I write in the book of travellers can, when read by others at some future date, also entertain them on their journey, then fine. If they don't read it, or are not entertained, that's fine too.", page: 573 },
      { text: "I have to choose what I detest — either dreaming, which my intelligence hates, or action, which my sensibility loathes; either action, for which I wasn't born, or dreaming, for which no one was born. Detesting both, I choose neither; but since I must on occasion either dream or act, I mix the two things together.", page: 577 },
      { text: "Whenever I've tried to free my life from a set of the circumstances that continuously oppress it, I've been instantly surrounded by other circumstances of the same order, as if the inscrutable web of creation were irrevocably at odds with me. I yank from my neck a hand that was choking me, and I see that my own hand is tied to a noose that fell around my neck when I freed it from the stranger's hand. When I gingerly remove the noose, it's with my own hands that I nearly strangle myself.", page: 777 }
    ]
  },
  {
    title: "The Scent of Time",
    author: "Byung-Chul Han",
    coverImageUrl: "/book_covers/scent_of_time.jpeg",
    description: "In his latest book, Byung-Chul Han examines the art of lingering in the context of our time-compressed digital age, arguing for a return to a more contemplative and meaningful experience of time.",
    link: "https://www.politybooks.com/bookdetail?book_slug=the-scent-of-time-a-philosophical-essay-on-the-art-of-lingering--9781509516049",
    highlights: [
      { text: "Time tumbles on, like an avalanche, precisely because it no longer contains anything to hold on to within itself. The tearing away of time, the directionless acceleration of processes (which, because of the lack of direction, is no longer really an acceleration at all), is triggered by those point-like presences between which there is no longer any temporal attraction. Acceleration in the proper sense of the word presupposes a course which directs the flow.", page: 321 },
      { text: "Promising, commitment and fidelity are genuinely temporal practices. They bind the future by continuing the present into the future and linking the two, thus creating a temporal continuity that has a stabilizing effect. This continuity protects the future against the violence of non-time. Where the practice of long-term commitment gives way to increasing short-termism, non-timeliness also increases, and is reflected at the psychological level in the form of anxiety and restlessness.", page: 347 },
      { text: "Torn time, the radical discontinuity of time which does not allow for remembrance, leads to a torturous sleeplessness. The first passages of Proust's novel, by contrast, present a gladdening experience of continuity, the mise en scène of an effortless hovering between sleeping, dreaming and awakening again, amidst a fluid medium made up of images belonging to memory and perception, a free to-and-fro between the past and present, between solid order and playful confusion.", page: 375 }
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
      { text: "No faction, no social ideology has the right to claim her. Her love of the people and her hatred of all oppression are not enough to place her among the leftists any more than her denial of progress and her cult for tradition authorize us to class her on the right. She put the same passionate enthusiasm into her political activities as into everything else, but far from making an idol of an idea, a nation or a class, she knew that the social field is above all the abode of what is relative and evil.", page: 218 },
      { text: "'If we know in what direction the scales of society are tilted we must do what we can to add weight to the lighter side. Although the weight may be something evil, if we handle it with this motive we shall perhaps not be tainted by it. But we must have a conception of equal balance and be always ready to change sides like Justice — that fugitive from the camp of conquerors.'", page: 226 },
      { text: "She had a horror of being given privileges and fiercely shook herself free from any watchful care which aimed at raising her above the common level. She only felt at ease on the lowest rung of the social ladder, lost among the masses of poor folk and outcasts of this world.", page: 239 },
      { text: "'We must welcome all opinions,' she used to say, 'but they must be arranged vertically and kept on suitable levels.'", page: 254 },
      { text: "Here is this abrupt and final refutation of all such philosophers as Schopenhauer or Sartre who argue that the presence of evil in the world justifies a fundamental pessimism: 'To say that the world is not worth anything, that this life is of no value, and to give evil as the proof is absurd, for if these things are worthless what does evil take from us?'", page: 267 },
      { text: "It is therefore a question of abolishing the self within us, 'that shadow thrown by sin and error which stops the light of God and which we take for a being.' Without this utter humility, this unconditional consent to be nothing, all forms of heroism and immolation are still subject to the law of gravity and falsehood: 'We can offer nothing short of ourselves.'", page: 302 },
      { text: "In order to kill the self we must be ready to endure all the wounds of life, exposing ourselves naked and defenceless to its fangs, we must accept emptiness, an unequal balance, we must never seek compensations and, above all, we must suspend the work of our imagination, 'which perpetually tends to stop up the cracks through which grace flows.'", page: 306 },
      { text: "So long as I hesitate between doing or not doing a bad action, even if I choose the good I scarcely rise above the evil I reject. In order for my 'good' action to be really pure, I must dominate this miserable oscillation so that the righteousness of my outward behaviour is the exact expression of my inward necessity.", page: 353 },
      { text: "'Everything that we want is in contradiction with the conditions or consequences which are attached to it. It is because we ourselves are a contradiction, being creatures, being God and infinitely other than God.' We must accept this contradiction — the sign of our misery and our greatness — in all its bitterness. It is through fully experiencing and suffering from the absurdity as such of this universe where good and evil are mixed that we attain to the pure goodness whose kingdom is not of this world.", page: 368 },
      { text: "This thirst for pure goodness leads to the suffering of expiation; in a perfectly innocent soul it produces redemptive suffering: 'To be innocent is to bear the weight of the whole universe. It is to throw in the counterweight to restore the balance.' 'The extreme greatness of Christianity lies in the fact that it does not seek a supernatural cure for suffering, but a supernatural use of it.'", page: 390 },
      { text: "The same action is easier if the motive is base than if it is noble. Base motives have in them more energy than noble ones. Problem: in what way can the energy belonging to the base motives be transferred to the noble ones?", page: 621 },
      { text: "I must not forget that at certain times when my headaches were raging I had an intense longing to make another human being suffer by hitting him in exactly the same part of his forehead. Analogous desires — very frequent in human beings. When in this state, I have several times succumbed to the temptation at least to say words which cause pain. Obedience to the force of gravity. The greatest sin. Thus we corrupt the function of language, which is to express the relationship between things.", page: 623 }
    ]
  },
  {
    title: "What Is Post-Branding?",
    author: "Jason Grant",
    coverImageUrl: "/book_covers/post_branding.jpg",
    description: "Part design experiment, part critical theory, part how-to manual, What Is Post-Branding? offers a creative counter to branding's neoliberal orthodoxy.",
    link: "https://www.artbook.com/9789083270678.html",
    highlights: [
      { text: "Branding is a key form of 'communicative capitalism' (Dean). Instead of exploited labour under industrial capitalism, now any act of communication (especially on monopolised digital platforms — a Google review, a tweet, an Instagram post) has the potential to become free labour that is brandable and transformable into economic value. It is this process which also destroys the meaningfulness of communication. Real political action and transformation is subverted by communicative capitalism exploiting communication. In this sense, abolishing branding is revolutionary.", page: 45 },
      { text: "In this world, when all you have is branding, everything looks like a brand. But if we stop framing basic human communication — and communication between actors whose primary motivation is not indefinite short term profit — as 'branding', we can more successfully promote our own values on our own terms.", page: 49 },
      { text: "To do branding is to obscure and reinforce hierarchies of privilege and class division. The branded, neoliberal unreal real is always constructed at the expense of the real real. Everyday political realities hide behind the rictus grin of a staged neoliberal reality — an endless enforced entrepreneurialism, where people's lives are shattered by a program of privatised, reduced or withdrawn essential social services and welfare support. Branding, as a weapon of neoliberal instrumentality, is complicit in embedding institutional inequality and disadvantage.", page: 51 },
      { text: "Branding can be a product of debt as a primary instrument of social control. In an indebted world people are forced into a precarious existence. Under these conditions people become 24/7 one person enterprises. The 'entrepreneur of the self' creates themself as a brand. Social media exploits this.", page: 53 },
      { text: "What branding doesn't capture through its spectacular media presence it conquers through addiction. It is complicit in the ever-increasing precarity of workers, as tenuous short-term contracts leave people with few choices other than to self-brand. The curation of the self-brand is a constant task performed largely through 'digital housekeeping'. What we post, what we like, who we connect with, and what we share becomes our brand.", page: 55 },
      { text: "These self-branding activities are enforced by technology designed to exploit our longing for experiencing pleasure. Because pleasure is an episodic phenomenon — it never lasts long — we try to reinforce and repeat actions which give us pleasure. Tiny bits of pleasure, which we experience if our posts get liked and shared, glue us to the screen. When we are worthless in the market, self-branding generates an illusion of self-worth. And capitalism sells the limitless engagement with such technology as 'freedom'.", page: 55 },
      { text: "Can we imagine an alternative method of communicating collective identity that supports the common good? Can we abandon the brandwagon? Can we imagine post-branding? Though branders may dismiss it as 'utopian', or 'naive', or as an 'activist aesthetic', post-branding is a change at the root of how and what we know — how we imagine the world and do things in it as designers.", page: 61 },
      { text: "Because post-branding sees the public sphere as inherently open, participatory and democratic, our role as designers is to guard these principles through our work. Designing identities is seen as a collective articulation of issues, needs and futures, and our work needs to focus on building these emancipatory alternative worlds.", page: 180 },
      { text: "In opposition to branding, post-branding aims to avoid producing extractive relations. At the start of every post-branding project is an evaluation about who we are working with. While professional designers can apply post-branding in their practice, post-branding, by definition, can't be done for clients and causes that harm our world.", page: 180 },
      { text: "Don't sell your conscience; don't sell your conscience. No money, no money, no money can buy good name. Good name is better than silver and gold. — William Onyeabor, 'Good Name', 1983", page: 267 }
    ]
  },
  {
    title: "Rework",
    author: "Jason Fried & David Heinemeier Hansson",
    coverImageUrl: "/book_covers/rework.jpg",
    description: "Jason Fried and David Heinemeier Hansson challenge traditional business wisdom in Rework, offering a lean and pragmatic approach to starting and running a business.",
    link: "https://williammeller.com/rework-by-jason-fried-david-heinemeier-hansson/",
    highlights: [
      { text: "Start getting into the habit of saying no — even to many of your best ideas. Use the power of no to get your priorities straight. You rarely regret saying no. But you often wind up regretting saying yes.", page: 1034 },
      { text: "Don't be a jerk about saying no, though. Just be honest. If you're not willing to yield to a customer request, be polite and explain why. People are surprisingly understanding when you take the time to explain your point of view.", page: 1045 },
      { text: "When you stick with your current customers come hell or high water, you wind up cutting yourself off from new ones. Your product or service becomes so tailored to your current customers that it stops appealing to fresh blood. And that's how your company starts to die.", page: 1056 },
      { text: "When you let customers outgrow you, you'll most likely wind up with a product that's basic — and that's fine. Small, simple, basic needs are constant. There's an endless supply of customers who need exactly that.", page: 1063 },
      { text: "The enthusiasm you have for a new idea is not an accurate indicator of its true worth. What seems like a sure-fire hit right now often gets downgraded to just a 'nice to have' by morning. And 'nice to have' isn't worth putting everything else on hold.", page: 1071 },
      { text: "These early days of obscurity are something you'll miss later on, when you're really under the microscope. Now's the time to take risks without worrying about embarrassing yourself.", page: 1116 },
      { text: "Build an audience. Speak, write, blog, tweet, make videos — whatever. Share information that's valuable and you'll slowly but surely build a loyal audience. Then when you need to get the word out, the right people will already be listening.", page: 1132 },
      { text: "Talk like you really talk. Reveal things that others are unwilling to discuss. Be upfront about your shortcomings. Show the latest version of what you're working on, even if you're not done yet. It's OK if it's not perfect. You might not seem as professional, but you will seem a lot more genuine.", page: 1185 },
      { text: "Accounting is a department. Marketing isn't. Marketing is something everyone in your company is doing 24/7/365.", page: 1227 },
      { text: "Great brands launch without PR campaigns all the time. Starbucks, Apple, Nike, Amazon, Google, and Snapple all became great brands over time, not because of a big PR push upfront.", page: 1253 },
      { text: "Never hire anyone to do a job until you've tried to do it yourself first. That way, you'll understand the nature of the work. You'll know what a job well done looks like. You'll know how to write a realistic job description and which questions to ask in an interview.", page: 1262 },
      { text: "With a small team, you need people who are going to do work, not delegate work. Everyone's got to be producing. No one can be above the work.", page: 1350 },
      { text: "Delegators love to pull people into meetings. In fact, meetings are a delegator's best friend. That's where he gets to seem important. Meanwhile, everyone else who attends is pulled away from getting real work done.", page: 1354 },
      { text: "It's crazy not to hire the best people just because they live far away. Especially now that there's so much technology out there making it easier to bring everyone together online. Geography just doesn't matter anymore.", page: 1374 },
      { text: "Getting back to people quickly is probably the most important thing you can do when it comes to customer service. It's amazing how much that can defuse a bad situation and turn it into a good one.", page: 1433 },
      { text: "A good apology accepts responsibility. It has no conditional 'if' phrase attached. It shows people that the buck stops with you. And then it provides real details about what happened and what you're doing to prevent it from happening again. And it seeks a way to make things right.", page: 1447 },
      { text: "After you introduce a new feature, change a policy, or remove something, knee-jerk reactions will pour in. Resist the urge to panic or make rapid changes in response. Passions flare in the beginning. That's normal. But if you ride out that first rocky week, things usually settle down. Negative reactions are almost always louder and more passionate than positive ones.", page: 1486 },
      { text: "Culture is the byproduct of consistent behavior. If you encourage people to share, then sharing will be built into your culture. If you reward trust, then trust will be built in. If you treat customers right, then treating customers right becomes your culture. Culture is action, not words.", page: 1512 },
      { text: "It's easy to shoot down good ideas, interesting policies, or worthwhile experiments by assuming that whatever you decide now needs to work for years on end. It's just not so, especially for a small business. If circumstances change, your decisions can change. Decisions are temporary.", page: 1522 },
      { text: "Rockstar environments develop out of trust, autonomy, and responsibility. When everything constantly needs approval, you create a culture of nonthinkers. You create a boss-versus-worker relationship that screams, 'I don't trust you.'", page: 1545 },
      { text: "You don't need more hours; you need better hours.", page: 1558 },
      { text: "As the saying goes, 'If you want something done, ask the busiest person you know.' You want busy people. People who have a life outside of work. People who care about more than one thing. You shouldn't expect the job to be someone's entire life — at least not if you want to keep them around for a long time.", page: 1561 },
      { text: "Policies are organizational scar tissue. They are codified overreactions to situations that are unlikely to happen again. They are collective punishment for the misdeeds of an individual.", page: 1566 },
      { text: "Don't talk about 'monetization' or being 'transparent;' talk about making money and being honest. Don't use seven words when four will do.", page: 1581 },
      { text: "Easy is a word that's used to describe other people's jobs. 'That should be easy for you to do, right?' But notice how rarely people describe their own tasks as easy.", page: 1602 },
      { text: "When you turn into one of these people who adds ASAP to the end of every request, you're saying everything is high priority. And when everything is high priority, nothing is. (Funny how everything is a top priority until you actually have to prioritize things.)", page: 1613 },
      { text: "If a task doesn't get done this very instant, nobody is going to die. Nobody's going to lose their job. It won't cost the company a ton of money. What it will do is create artificial stress, which leads to burnout and worse. So reserve your use of emergency language for true emergencies.", page: 1617 },
      { text: "If you're inspired on a Friday, swear off the weekend and dive into the project. When you're high on inspiration, you can get two weeks of work done in twenty-four hours. Inspiration is a time machine in that way. Inspiration is a now thing. If it grabs you, grab it right back and put it to work.", page: 1626 }
    ]
  },
  {
    title: "On the Shortness of Life",
    author: "Seneca",
    coverImageUrl: "/book_covers/shortness_of_life.jpg",
    description: "Seneca's timeless essay on the value of time and the importance of living a purposeful and intentional life, free from the distractions of ambition and leisure.",
    link: "https://www.goodreads.com/book/show/58649040-on-the-shortness-of-life",
    highlights: [
      { text: "It was this that made the greatest of physicians exclaim that 'life is short, art is long.'", page: 1 },
      { text: "'The part of life we really live is small.' For all the rest of existence is not life, but merely time. Vices beset us and surround us on every side, and they do not permit us to rise anew and lift up our eyes for the discernment of truth, but they keep us down when once they have overwhelmed us and we are chained to lust.", page: 3 }
    ]
  },
  {
    title: "Governing the Commons",
    author: "Elinor Ostrom",
    coverImageUrl: "/book_covers/governing_commons.jpg",
    description: "In this seminal work, Elinor Ostrom explores how traditional communities manage collective resources without top-down regulation or privatization, offering a powerful alternative to the 'tragedy of the commons'.",
    link: "https://www.abebooks.com/servlet/BookDetailsPL?bi=22912392178&dest=usa&ref_=ps_ms_267691761&cm_mmc=msn-_-comus_dsa-_-naa-_-naa&msclkid=796b7dc5145e1098cc261471692c291f",
    highlights: [
      { text: "Therein is the tragedy. Each man is locked into a system that compels him to increase his herd without limit — in a world that is limited. Ruin is the destination toward which all men rush, each pursuing his own best interest in a society that believes in the freedom of the commons. (Hardin 1968)", page: 301 },
      { text: "Aristotle long ago observed that 'what is common to the greatest number has the least care bestowed upon it. Everyone thinks chiefly of his own, hardly at all of the common interest.' (Politics, Book II, ch. 3)", page: 304 },
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
      { text: "To photograph is to appropriate the thing photographed. It means putting oneself into a certain relation to the world that feels like knowledge — and, therefore, like power.", page: 51 },
      { text: "Using a camera appeases the anxiety which the work-driven feel about not working when they are on vacation and supposed to be having fun. They have something to do that is like a friendly imitation of work: they can take pictures.", page: 135 },
      { text: "Photographs, which cannot themselves explain anything, are inexhaustible invitations to deduction, speculation, and fantasy.", page: 313 },
      { text: "Photography implies that we know about the world if we accept it as the camera records it. But this is the opposite of understanding, which starts from not accepting the world as it looks. All possibility of understanding is rooted in the ability to say no.", page: 314 },
      { text: "Needing to have reality confirmed and experience enhanced by photographs is an aesthetic consumerism to which everyone is now addicted.", page: 327 },
      { text: "Industrial societies turn their citizens into image-junkies; it is the most irresistible form of mental pollution. Poignant longings for beauty, for an end to probing below the surface, for a redemption and celebration of the body of the world — all these elements of erotic feeling are affirmed in the pleasure we take in photographs.", page: 328 },
      { text: "Steichen's choice of photographs assumes a human condition or a human nature shared by everybody. By purporting to show that individuals are born, work, laugh, and die everywhere in the same way, 'The Family of Man' denies the determining weight of history — of genuine and historically embedded differences, injustices, and conflicts.", page: 425 },
      { text: "The photographer is always trying to colonize new experiences or find new ways to look at familiar subjects — to fight against boredom.", page: 545 },
      { text: "Social misery has inspired the comfortably-off with the urge to take pictures, the gentlest of predations, in order to document a hidden reality, that is, a reality hidden from them.", page: 700 },
      { text: "The photographer is an armed version of the solitary walker reconnoitering, stalking, cruising the urban inferno, the voyeuristic stroller who discovers the city as a landscape of voluptuous extremes. Adept of the joys of watching, connoisseur of empathy, the flâneur finds the world 'picturesque.'", page: 705 },
      { text: "Photographs, which turn the past into a consumable object, are a short cut. Any collection of photographs is an exercise in Surrealist montage and the Surrealist abbreviation of history.", page: 885 },
      { text: "Photography has become the quintessential art of affluent, wasteful, restless societies — an indispensable tool of the new mass culture.", page: 896 },
      { text: "In a world that is well on its way to becoming one vast quarry, the collector becomes someone engaged in a pious work of salvage. The course of modern history having already sapped the traditions and shattered the living wholes in which precious objects once found their place, the collector may now in good conscience go about excavating the choicer, more emblematic fragments.", page: 985 },
      { text: "The habit of photographic seeing — of looking at reality as an array of potential photographs — creates estrangement from, rather than union with, nature.", page: 1236 },
      { text: "Photographic seeing, when one examines its claims, turns out to be mainly the practice of a kind of dissociative seeing, a subjective habit which is reinforced by the objective discrepancies between the way that the camera and the human eye focus and judge perspective.", page: 1238 },
      { text: "Socially concerned photographers assume that their work can convey some kind of stable meaning, can reveal truth. But partly because the photograph is, always, an object in a context, this meaning is bound to drain away. One of the central characteristics of photography is that process by which original uses are modified, eventually supplanted by subsequent uses — most notably, by the discourse of art into which any photograph can be absorbed.", page: 1352 },
      { text: "As Walter Benjamin observed in 1934: 'The camera is now incapable of photographing a tenement or a rubbish-heap without transfiguring it. Not to mention a river dam or an electric cable factory: in front of these, photography can only say, How beautiful. It has succeeded in turning abject poverty itself, by handling it in a modish, technically perfect way, into an object of enjoyment.'", page: 1364 },
      { text: "In fact, words do speak louder than pictures. Captions do tend to override the evidence of our eyes; but no caption can permanently restrict or secure a picture's meaning.", page: 1384 },
      { text: "Protected middle-class inhabitants of the more affluent corners of the world — those regions where most photographs are taken and consumed — learn about the world's horrors mainly through the camera: photographs can and do distress. But the aestheticizing tendency of photography is such that the medium which conveys distress ends by neutralizing it. Cameras miniaturize experience, transform history into spectacle. As much as they create sympathy, photographs cut sympathy, distance the emotions.", page: 1397 },
      { text: "Photography, like pop art, reassures viewers that art isn't hard; it seems to be more about subjects than about art.", page: 1647 }
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
      { text: "The good professor who characterized the offending letter and, by extension, its signatories as 'divisive' and 'demoralizing' was unwittingly giving voice to a sentiment widely shared in the American academic community. To challenge officially accredited views, particularly when those views have anything to do with sensitive issues, is now regarded as out of bounds, illegitimate, an expression of arrogance or entitlement, and thereby hostile.", page: 482 },
      { text: "The burning desire to paint a scarlet letter on the breast of those who fail to observe the officially sanctioned view of things has taken possession of many ostensibly liberal persons in the academy, which has tended more and more in recent years to resemble what the cultural critic David Bromwich calls 'a church, held together by the hunt for heresies.'", page: 507 },
      { text: "Nicholas Kristof of the New York Times argues that many liberals 'want to be inclusive of people who don't look like us — so long as they think like us.' On campuses across the country, academics casually admit that 'they would discriminate in hiring decisions' based on 'the ideological views of a job applicant.'", page: 552 },
      { text: "Academics tend to have higher-than-average IQs and are predictably 'able to generate more reasons' to account for what they believe. But high-IQ people typically produce 'only [a greater] number of my-side arguments' and 'are no better than others at finding reasons on the other side.' This is especially troubling in the culture of the university, where diversity of outlook and idea, and resistance to accredited formulas, is at least theoretically central to the institutional mission.", page: 582 },
      { text: "As Cass Sunstein notes, 'like-minded people [largely] insulated' from those with disparate views are apt to be moved by 'parochial influences' and to insist upon talking 'only to one another.'", page: 615 },
      { text: "Yang calls it 'the manner in which activists are seeking to win a debate — not through scholarship, persuasion, and debate… [but] through the subornation of administrative and disciplinary power to delegitimize, stigmatize, disqualify, surveil, forbid, shame, and punish holders of contrary views.'", page: 622 }
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
      { text: "Ma. You once told me that memory is a choice. But if you were god, you'd know it's a flood.", page: 1010 },
      { text: "Beats punctuated by the sound of beer bottles bursting on the basketball court across the street, the crackheads lobbing the empties up in the sky, just to see how the streetlights make broken things seem touched by magic, glass sprinkled like glitter on the pavement come morning.", page: 1110 },
      { text: "There were colors, Ma. Yes, there were colors I felt when I was with him. Not words — but shades, penumbras.", page: 1363 },
      { text: "Afterward, lying next to me with his face turned away, he cried skillfully in the dark. The way boys do. The first time we fucked, we didn't fuck at all.", page: 1481 },
      { text: "I did not know then what I know now: to be an American boy, and then an American boy with a gun, is to move from one end of a cage to another.", page: 1499 },
      { text: "Because something in him knew she'd be there. That she was waiting. Because that's what mothers do. They wait. They stand still until their children belong to someone else.", page: 1635 },
      { text: "In a world myriad as ours, the gaze is a singular act: to look at something is to fill your whole life with it, if only briefly.", page: 2181 },
      { text: "I know. It's not fair that the word laughter is trapped inside slaughter.", page: 2321 },
      { text: "The Greeks thought sex was the attempt of two bodies, separated long ago, to return to one life. I don't know if I believe this but that's what it felt like: as if we were two people mining one body, and in doing so, merged, until no corner was left saying I.", page: 2502 },
      { text: "To ask What's good? was to move, right away, to joy. It was pushing aside what was inevitable to reach the exceptional. Not great or well or wonderful, but simply good. Because good was more often enough, was a precious spark we sought and harvested of and for one another.", page: 2660 },
      { text: "All freedom is relative — you know too well — and sometimes it's no freedom at all, but simply the cage widening far away from you, the bars abstracted with distance but still there, as when they 'free' wild animals into nature preserves only to contain them yet again by larger borders.", page: 2682 }
    ]
  },
  {
    title: "No Logo",
    author: "Naomi Klein",
    coverImageUrl: "/book_covers/no_logo.jpg",
    description: "Naomi Klein's seminal work on the rise of anti-corporate activism and the impact of global branding on culture and labor.",
    link: "https://www.goodreads.com/book/show/647.No_Logo",
    highlights: [
      { text: "Bush's budget director Mitch Daniels said, 'The general idea — that the business of government is not to provide services, but to make sure that they are provided — seems self-evident to me.'", page: 161 },
      { text: "By the end of eight years of self-immolation under Bush, the state still has all the trappings of a government — the impressive buildings, presidential press briefings, policy battles — but it no more did the actual work of governing than the employees at Nike's Beaverton campus actually stitched running shoes. Governing, it seemed, was not its core competency.", page: 206 },
      { text: "This preference for symbols over substance, and this unwillingness to stick to a morally clear if unpopular course, is where Obama decisively parts ways with the transformative political movements from which he has borrowed so much (his pop-art posters from Che, his cadence from King, his 'Yes We Can!' slogan from the migrant farmworkers' Si Se Puede).", page: 287 },
      { text: "Obama didn't just rebrand America, he resuscitated the neoliberal economic project when it was at death's door.", page: 317 },
      { text: "Nike, for example, is leveraging the deep emotional connection that people have with sports and fitness. With Starbucks, we see how coffee has woven itself into the fabric of people's lives, and that's our opportunity for emotional leverage. A great brand raises the bar — it adds a greater sense of purpose to the experience.", page: 806 },
      { text: "Advertising is about hawking product. Branding, in its truest and most advanced incarnations, is about corporate transcendence.", page: 817 },
      { text: "MTV itself: the first truly branded network. Though there have been dozens of imitators since, the original genius of MTV is that viewers didn't watch individual shows, they simply watched MTV.", page: 1179 },
      { text: "Like so much of cool hunting, Hilfiger's marketing journey feeds off the alienation at the heart of America's race relations: selling white youth on their fetishization of black style, and black youth on their fetishization of white wealth.", page: 1753 },
      { text: "These CEOs are the new rock stars — and why shouldn't they be? Forever trailing the scent of cool, they are full-time, professional teenagers, but unlike real teenagers, they have nothing to distract them from the hot pursuit of the edge: no homework, puberty, college-entrance exams or curfews for them.", page: 1839 },
      { text: "To determine whether a movement genuinely challenges the structures of economic and political power, one need only measure how affected it is by the goings-on in the fashion and advertising industries. If, even after being singled out as the latest fad, it continues as if nothing had happened, it's a good bet it is a real movement.", page: 1915 },
      { text: "The market has seized upon multiculturalism and gender-bending in the same ways that it has seized upon youth culture in general — not just as a market niche but as a source of new carnivalesque imagery.", page: 2407 },
      { text: "Rather than creating different advertising campaigns for different markets, campaigns could sell diversity itself, to all markets at once. The formula maintained the one-size-fits-all cost benefits of old-style cowboy cultural imperialism, but ran far fewer risks of offending local sensibilities.", page: 2449 },
      { text: "More than anything or anyone else, logo-decorated middle-class teenagers, intent on pouring themselves into a media-fabricated mold, have become globalization's most powerful symbols.", page: 2469 },
      { text: "Within these real and virtual branded edifices, options for unbranded alternatives, for open debate, criticism and uncensored art — for real choice — are facing new and ominous restrictions.", page: 2623 },
      { text: "Brands are about 'meaning,' not product attributes. The highest feat of branding comes when companies provide their consumers with opportunities not merely to shop but to fully experience the meaning of their brand.", page: 2878 },
      { text: "Artists will always make art by reconfiguring our shared cultural languages and references, but as those shared experiences shift from firsthand to mediated, and the most powerful political forces in our society are as likely to be multinational corporations as politicians, a new set of issues emerges that once again raises serious questions about out-of-date definitions of freedom of expression in a branded culture. Telling video artists that they can't use old car commercials, or musicians that they can't sample or distort lyrics, is like banning the guitar or telling a painter he can't use red.", page: 3451 },
      { text: "The underlying message is that culture is something that happens to you. You buy it at the Virgin Megastore or Toys R Us and rent it at Blockbuster Video. It is not something in which you participate, or to which you have the right to respond.", page: 3451 },
      { text: "Brand-name multinationals have divested the 'means of production,' to use Marx's phrase, unwilling to encumber themselves with the responsibilities of actually owning and managing the factories, and employing a labor force.", page: 4257 },
      { text: "This internalized state of perpetual transience has been convenient for service-sector employers who have been free to let wages stagnate and to provide little room for upward mobility, since there is no urgent need to improve the conditions of jobs that everyone agrees are only temporary.", page: 4375 },
      { text: "Writing in The Wall Street Journal, Kay points out that the exorbitant salaries American companies have taken to paying their CEOs is a 'crucial factor making the U.S. economy the most competitive in the world' because without juicy bonuses company heads would have 'no economic incentive to face up to difficult management decisions, such as layoffs.'", page: 4780 },
      { text: "What is emerging out of this growing trend of tying executive pay to stock performance is a corporate culture so damaged that workers must often be fired or shortchanged for the boss to get paid.", page: 4804 },
      { text: "Anytime people mess with a logo, they are tapping into the vast resources spent to make that logo meaningful. Kalle Lasn, editor of Adbusters magazine, uses the martial art of jujitsu as a precise metaphor to explain the mechanics of the jam. 'In one simple deft move you slap the giant on its back. We use the momentum of the enemy.'", page: 5117 },
      { text: "'Advertising,' as George Orwell once said, 'is the rattling of a stick inside a swill bucket.'", page: 5531 },
      { text: "Most advertising criticism reeks of contempt for the people who 'want — ugh! — things.' Such a theory can never hope to form the intellectual foundation of an actual resistance movement against the branded life, since genuine political empowerment cannot be reconciled with a belief system that regards the public as a bunch of ad-fed cattle, held captive under commercial culture's hypnotic spell.", page: 5535 },
      { text: "The earth is not dying, it is being killed. And those that are killing it have names and addresses. — Utah Phillips", page: 5854 },
      { text: "In his book Silent Coup, Tony Clark argues that citizens must go after corporations not because we don't like their products, but because corporations have become the ruling political bodies of our era, setting the agenda of globalization. We must confront them, in other words, because that is where the power is.", page: 6121 },
      { text: "For years, we in this movement have fed off our opponents' symbols — their brands, their office towers, their photo-opportunity summits. We have used them as rallying cries, as focal points, as popular education tools. But these symbols were never the real targets; they were the levers, the handles. The symbols were only ever doorways. It's time to walk through them. — Naomi Klein, February 2002", page: 8157 }
    ]
  },
  {
    title: "Tokens",
    author: "Rachel O'Dwyer",
    coverImageUrl: "/book_covers/tokens.jpg",
    description: "An essential guide to how digital tokens, NFTs, and crypto are redefining our social and economic landscape, often in ways that favor platforms over people.",
    link: "https://www.penguinrandomhouse.com/books/721301/tokens-by-rachel-odwyer/",
    highlights: [
      { text: "There are different meanings wrapped in a wink. A wink is deliberate, directed at a particular person, and used to get a message across that won't formally register with others. Winks are part of an established code. Winks are layered with social meaning.", page: null },
      { text: "The Chinese super-apps WeChat and Alibaba, with legacies in gaming and online retail, operate the payments systems that are used by virtually all Chinese citizens. The apps support online and in-store purchases, gameplay and virtual gifting. In turn, the data produced by these activities is used to underwrite credit.", page: 123 },
      { text: "In 7500 BC, Neolithic tokens emerged alongside the development of agriculture. The first tokens responded to a need to store and trade goods collectively. Clay was fixed into simple shapes representing commodities — quantities of grain, oil, livestock, and human labour. These tokens were not only the first example of accounting; they were also the first example of written record-keeping.", page: null },
      { text: "By transforming or limiting the liquidity of everyday money, tokens could be programmed to curb the economic freedoms of particular social groups: scrip tokens for workers that could only be spent in the employer's own store; store credit for a wife; vouchers and food stamps for the poor. Tokens can thus also be a way of attaching special conditions to payments.", page: null },
      { text: "Technology is never neutral. Who shapes it and what it does have political consequences. As Langdon Winner noted, our 'artefacts have politics.' Over time, as a technology moves from the shiny foreground into the background, these effects are fixed, even forgotten.", page: 232 },
      { text: "For Twitch, Bits are a way of capturing value from content on the platform, but they are also a regulatory sleight of hand, a way of employing workers without a contract and processing payments without a financial licence.", page: 293 },
      { text: "Because tokens are not real money, they hide the transaction. They abstract the work away. They allow everyone to pretend that what is happening is 'just for fun', that it happens 'among friends'.", page: 565 },
      { text: "In the pre-capitalist system, a landlord extracted value by virtue of ownership rather than through any direct organisation of workers. Platforms are just the same: they are the slumlords and feudal kings of the internet.", page: null },
      { text: "In a design informatics project, artist Hang Do Thi Duc illustrated Venmo data in an artwork called Public by Default, revealing just how much could be gleaned from the company's public API. The designer used Venmo's public transactional data to trace the lives of five users she had never met, including a romantic couple, a food cart owner, and a weed dealer.", page: null },
      { text: "Researchers subsequently reverse-engineered the Venmo feed to pinpoint members of AA, drug deals, users with a chronic gambling problem, illicit romantic affairs, and sex work. Transactions could tell the story of an acrimonious breakup through a flurry of invoices for half a couch.", page: null },
      { text: "Amazon's 2014 patent for anticipatory shipping — a logistical model using transactional and browsing history to predict future purchases — is one well-hyped example. Instead of waiting to process an order, the company can ship items it predicts a customer will buy later to a warehouse near them.", page: null },
      { text: "A third and rising trend is the use of transactional data to underwrite credit and insurance. Companies now specialise in credit offerings based on mined transactional data. They target users who have limited access to financial services — the 'underserved' or 'unbanked' — but also users whose credit, in the aftermath of a crash and a pandemic, has been damaged.", page: null },
      { text: "Alibaba's three-digit 'Zhima Score' dictates the terms of a personal loan based on variables such as what degrees its customers hold, data from their social networks, and how many video games they have purchased in the past month — but it also affects visibility on Chinese dating sites, employability, and even access to a Schengen Visa.", page: 1088 },
      { text: "Critics often point to the inherent bias of those who write the code, but also to the fact that the machine learns from a wealth of historical transaction data that is chock-full of old inferences and resentments. It has been shown, for example, that having an African-American name negatively affects the new algorithmic credit scores.", page: null },
      { text: "As governments explore the development of central bank digital currencies (CBDCs) — digital tokens tied to the central bank — the possibilities for direct government transactional surveillance loom large. Hyun Shin of the Bank for International Settlements spoke evocatively of the CBDC as money with memory.", page: null },
      { text: "There is a tension here between the control and issuance of a token by the state and the ability of a person on the street to use this public medium for critique — to send a signal back to power, or out into the world. Because the messages are anonymous, they are safe to convey. Cash acts as an analogue point-to-point medium, something that everybody uses but nobody quite controls.", page: null },
      { text: "For journalist Brett Scott, the pandemic was a keystone in the ongoing 'cold war against cash' — a push to wean people from physical, public tender onto traceable tokens. The way Scott sees it, all digital money — whether issued by a crypto start-up, or PayPal, or a commercial bank — is nothing more than private scrip, drawn on the deferred promise of redemption through state-backed money.", page: null },
      { text: "My interactions with Bitcoin zealots have made me wary of men who want to single-handedly redesign the economy.", page: 1315 },
      { text: "With money burning, the initiative stems less from a desire to erase the promise inscribed on a banknote than from a desire to erase the contractual obligations of the money relation altogether, revealing what one burner describes as 'our blind fixation on money as an object through the act of destruction.'", page: null }
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
      { text: "Ever since he had met Momo, his tales had grown wings, and whenever Momo was around listening to him, his imagination began to blossom like a garden in spring. Children and adults alike crowded around, and he began telling stories that spanned days or weeks and which he therefore broke into many installments. What's more, he listened to himself with the same suspense and curiosity as the others, because even he had no idea where his imagination would lead him.", page: 582 },
      { text: "Everyone is in on it and everyone knows what it is, but very few people ever think about it. Most people just take it for granted without wondering the slightest bit about it. The secret is time. We have calendars and clocks to measure time, but they mean little: everyone knows a single hour can seem like an eternity or pass in a flash. It all depends on what we experience in that hour. Time is the very essence of life itself, and life exists in our hearts.", page: 772 },
      { text: "'Surely you already know how to save time! In brief, you have to work faster and stop doing anything superfluous. Instead of devoting half an hour to your customers, only spend fifteen minutes with them. Avoid time-wasting conversations. Reduce the hour you spend with your mother to half an hour. Better yet, just put her in a good, cheap retirement home where she'll be taken care of. Get rid of the useless parakeet! Get rid of your fifteen-minute nightly review of the day's events, and don't waste so much of your precious time singing, reading, or going out with your so-called friends.'", page: 912 },
      { text: "But it was only his memory of the visitor that had vanished, not his memory of the decision. He now simply thought he had come to this new resolution all by himself. His intention — to save time in order to begin another life in the future — held fast in his soul like a barbed hook.", page: 936 },
      { text: "Daily advertisements revealed and praised the advantages of new time-saving devices that would one day leave people free to live the 'proper' life. Underneath them, in bright neon letters, stood slogans like: EVERYTHING RUNS BETTER ON SAVED TIME! SAVING TIME FOR THE FUTURE! MAKE MORE OF YOUR LIFE — SAVE TIME!", page: 959 },
      { text: "Nobody seemed to notice that by saving time they were actually losing something much more important. These people didn't want to believe that their lives were becoming poorer and poorer, colder and more monotonous. Only the children seemed to notice because no one had time for them anymore. But time is life, and life exists in our hearts, and the more of it that the people saved, the less they actually had.", page: 987 },
      { text: "'The only thing that matters in life,' the gray man went on, 'is success, making something of yourself, owning things. Anyone who goes further, makes more of himself, and earns more money than other people will get all the rest automatically: friendship, love, marriage, etc. Now, you say you love your friends. Let's examine that statement objectively.'", page: 1321 },
      { text: "'We must remain unrecognizable. No one can know that we exist and what we do… exhausting work, stealing people's time — hours, minutes, and seconds… all the time that they save is actually lost to them… we take it for ourselves… we store it up… we need it… we hunger for it… ah! You have no idea how valuable your time is! But we, we know, and we suck it away from you… suck you dry… and we always need more… always more… always more…'", page: 1352 },
      { text: "'Couldn't you easily just make it so that the time thieves can't steal anymore time?' 'No, I cannot,' answered Master Hora. 'People must decide for themselves what to do with their time, just as they must defend it themselves. I can only give it to them.'", page: 2284 },
      { text: "'Are you Death?' Master Hora smiled and remained silent for a while before he answered. 'If people only knew what death was they wouldn't be so afraid of it; and if they weren't afraid of it, no one would be able to steal their time anymore.'", page: 2299 },
      { text: "'In the beginning you don't notice much, but then, all of a sudden, you're not in the mood to do anything at all. Nothing interests you anymore, and you begin to waste away. But this disinterest doesn't just disappear after a while — no, it gets worse from day to day. You feel sadder and more morose, emptier inside, and increasingly unhappy with yourself and with the world in general. Then, after a while, even that feeling goes away, and you don't feel anything at all. You become indifferent, gray, and the whole world begins to feel foreign and strange. Then everything is cold, and you can no longer love. Once it's come to that, the sickness is no longer treatable. The disease has a name: it's called Deadly Apathy.'", page: 3481 }
    ]
  },
  {
    title: "Vestoj",
    author: "Anja Aronowsky Cronberg",
    coverImageUrl: "/book_covers/vestoj.jpg",
    description: "A research platform and journal that examines the relationship between fashion, culture, and identity, providing a critical and intellectual perspective on why we wear what we wear.",
    link: "https://vestoj.com/about/",
    highlights: [
      { text: "If culture were fungible, like economic capital, all one needs is to have it. But if its value is conditional on the identity of the holder, then the situation is quite different. We can't assume that if the dominated could just 'have' the right cultural, social, or symbolic capital, then equality would follow. Doing so, in fact, tends to blame the dominated for their condition. They just have the wrong tastes. But what if having a certain kind of cultural capital fails to yield the same amount for you — not because of what you know but because of who you are? Or what if you could add value to a culture genre not because of how you do it, but because of what it means for you to do it? Your power, not the quality of your performance, makes the devalued object, somehow, more valuable.", page: null }
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
  },
  {
    id: 'yournyc',
    title: 'Your NYC',
    subtitle: 'Civic Project',
    description: 'An ongoing open-source civic initiative making city data accessible and interactive. What started as a project to turn New York City\'s published documents into a dedicated application has since expanded to include San Francisco, helping citizens easily browse, filter, and find what\'s relevant to their neighborhood.',
    icon: <FileText size={32} />,
    color: '#0ea5e9',
    image: '/projects/yournyc_hero.jpg',
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
  const [isRetroMode, setIsRetroMode] = useState(false);
  const [isBootingUp, setIsBootingUp] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [bootLines, setBootLines] = useState([]);
  const [shutdownLines, setShutdownLines] = useState([]);
  const [isPoweringOff, setIsPoweringOff] = useState(false);
  const [isWindowsLoading, setIsWindowsLoading] = useState(false);
  const [isCursorBusy, setIsCursorBusy] = useState(false);
  const [isShutdownConfirmOpen, setIsShutdownConfirmOpen] = useState(false);
  const [shutdownChoice, setShutdownChoice] = useState('shutdown');
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

  React.useEffect(() => {
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

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Retro Mode with Shift + P. Side effects live OUTSIDE the
      // setState updater to avoid double-firing under React.StrictMode.
      if (e.shiftKey && e.key.toLowerCase() === 'p') {
        const next = !isRetroMode;
        setIsRetroMode(next);
        if (next) {
          // Boot chain: DOS BIOS → Windows startup video → desktop with busy cursor.
          // The video carries its own audio (no separate playPowerOn).
          setBootLines([]);
          setIsBootingUp(true);
          setIsWindowsLoading(false);
          setIsCursorBusy(false);
          setIsShuttingDown(false);
          setShowGame(false);
          setIsStartMenuOpen(false);
          // Play the power-on sfx during the DOS boot phase. Capture the
          // audio node so we can fade it out right when the startup video
          // takes over (the video carries its own audio).
          let powerOnNode = null;
          try { powerOnNode = playPowerOn(); } catch {}

          let acc = 0;
          BOOT_SCRIPT.forEach(([delay, text]) => {
            acc += delay;
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

      // Exit everything with Escape
      if (e.key === 'Escape') {
        setShowGame(false);
        setIsRetroMode(false);
        setIsBootingUp(false);
        setIsWindowsLoading(false);
        setIsCursorBusy(false);
        setIsStartMenuOpen(false);
        setIsShutdownConfirmOpen(false);
        try { stopAmbient({ fade: 250 }); } catch {}
      }

      // Play a key click while the CRT is open.
      if (isRetroMode && !isBootingUp && e.key !== 'Escape' && !e.repeat) {
        try { playKeyboard(); } catch {}
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  // Called when the Windows startup video finishes (or errors). Reveals the
  // desktop with a brief busy/progress cursor before settling to normal.
  const handleStartupVideoEnded = React.useCallback(() => {
    setIsWindowsLoading(false);
    setIsCursorBusy(true);
    try { startAmbient(0.3); } catch {}
    setTimeout(() => setIsCursorBusy(false), 2400);
  }, []);

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
    }, acc + 2400);
  };

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 850;

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
                
                {!isMobile && (
                  <motion.div 
                    className="intro-ps"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.6 } }}
                    transition={{ delay: 1 }}
                  >
                    PS: Want a quick break? Press Shift + P to launch a 1990s-era PC and play some of my favorite games from back in the day.
                  </motion.div>
                )}
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
                      >
                        {/* Scanlines + vignette overlays */}
                        <div className="crt-scanlines" />
                        <div className="crt-vignette" />
                        {/* Glass overlays — smudge + inner shadow */}
                        <div className="crt-shadow-overlay" />
                        <div className="crt-smudge-overlay" />
                        {/* DOS-style boot-up screen */}
                        {isBootingUp && (
                          <div className="crt-dos-screen">
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
                              onEnded={handleStartupVideoEnded}
                              onError={handleStartupVideoEnded}
                            />
                          </div>
                        )}
                        {/* Win95 desktop */}
                        <div className="crt-win95-desktop">
                          {/* Desktop icons */}
                          {!showGame && (
                             <>
                               {retroGames.map(game => (
                                 <div key={game.id} className="crt-desk-icon" onClick={() => { setCurrentGame(game); setShowGame(true); }}>
                                   <div className="crt-desk-icon-img">
                                     <img src={game.coverArtUrl} alt={game.name} />
                                   </div>
                                   <span>{game.name}</span>
                                 </div>
                               ))}
                             </>
                           )}
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
                                  style={{ aspectRatio: (currentGame.aspectRatio || '4/3').replace('/', ' / ') }}
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
                        {/* Taskbar */}
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
                          <Win95Clock />
                        </div>
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
                      <div
                        className="crt-ctrl-btn"
                        onClick={() => { try { playMonitorClick(); } catch {} }}
                      />
                      <div
                        className="crt-ctrl-btn"
                        onClick={() => { try { playMonitorClick(); } catch {} }}
                      />
                      <div
                        className="crt-power-btn"
                        onClick={() => {
                          if (isPoweringOff) return;
                          try { playMonitorClick(); } catch {}
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
                          }, 1000);
                        }}
                      >
                        <div className="crt-power-led" />
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
                        <div className="credits-row">
                          <span>henryheffernan.com</span><span>Original portfolio that started this</span>
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
                        onClick={() => setIsShutdownConfirmOpen(false)}
                      >Help</button>
                    </div>
                  </div>
                )}


                <div className="crt-game-manual">
                  {showGame && (
                    <div className="manual-content">
                      <span className="manual-title">{currentGame.name} Manual</span>
                      <div className="manual-row">
                        <span className="manual-label">OBJECTIVE:</span>
                        <p>{currentGame.instructions}</p>
                      </div>
                      <div className="manual-row">
                        <span className="manual-label">CONTROLS:</span>
                        <p>{currentGame.controls}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="crt-esc-hint">press esc or click power to exit</div>
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
              <div className="grid">
                {products.map(p => (
                  <motion.div 
                    layoutId={`product-${p.name}`}
                    key={p.name} 
                    className={`card product-card ${p.expandable ? 'expandable' : ''}`}
                    onClick={() => {
                      if (p.expandable) {
                        setExpandedProduct(p);
                      } else {
                        window.open(p.link, '_blank');
                      }
                    }}
                    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                    style={{ cursor: 'pointer' }}
                  >
                    {p.iconUrl && (
                      <img src={p.iconUrl} alt={`${p.name} icon`} className="product-icon" />
                    )}
                    <h3 style={{ marginBottom: '1rem' }}>{p.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                      {p.desc}{p.expandable && '...'}
                    </p>
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
                  {(project.image || project.iframe) && (
                    <div className="project-card-image">
                      {project.iframe ? (
                        <iframe 
                          src={project.iframe} 
                          title={project.title} 
                          style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                          scrolling="no"
                        />
                      ) : (
                        <img src={project.image} alt={project.title} />
                      )}
                      {!project.noOverlay && (
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
    <div className="container">
      {timePhase === 'evening' && <NightSky />}
      {(() => {
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
    </div>
  );
}

export default App;
