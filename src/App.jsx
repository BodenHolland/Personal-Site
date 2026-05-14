import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SunCalc from 'suncalc';
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
    link: "https://ndpr.nd.edu/reviews/before-forgiveness-the-origin-of-a-moral-idea/"
  },
  {
    title: "The Cambridge Companion to Hannah Arendt",
    author: "Dana Villa",
    coverImageUrl: "/book_covers/arendt_new_cover.jpg",
    description: "This volume examines the primary themes of Hannah Arendt's multi-faceted work, providing a comprehensive overview of her political and philosophical thought.",
    link: "https://www.goodreads.com/en/book/show/127243"
  },
  {
    title: "A General Theory of Love",
    author: "Thomas Lewis, Fari Amini, and Richard Lannon",
    coverImageUrl: "/book_covers/book4.jpg",
    description: "This original and lucid account draws on latest scientific research to show how our nervous systems are not self-contained, but linked with those around us.",
    link: "https://www.goodreads.com/en/book/show/35711"
  },
  {
    title: "No Rules Rules",
    author: "Reed Hastings and Erin Meyer",
    coverImageUrl: "/book_covers/book5.jpg",
    description: "Netflix co-founder Reed Hastings and professor Erin Meyer explore the controversial management philosophy and culture of freedom and responsibility that powered Netflix's success.",
    link: "https://www.norulesrules.com/"
  },
  {
    title: "Butter Honey Pig Bread",
    author: "Francesca Ekwuyasi",
    coverImageUrl: "/book_covers/book6.jpg",
    description: "An interwoven multi-generational saga of three Nigerian women, examining the choices they make and the fractures that occur when family secrets are revealed.",
    link: "https://www.goodreads.com/en/book/show/51168133"
  },
  {
    title: "In Praise of Shadows",
    author: "Junichiro Tanizaki",
    coverImageUrl: "/book_covers/book7.jpg",
    description: "An eloquent essay on Japanese aesthetics, exploring the use of light and darkness in architecture and art, contrasting it with Western preferences.",
    link: "https://www.theatlantic.com/magazine/archive/1955/01/in-praise-of-shadows-a-prose-elegy/641477/"
  },
  {
    title: "Amusing Ourselves to Death",
    author: "Neil Postman",
    coverImageUrl: "/book_covers/book8.jpg",
    description: "Neil Postman's classic critique of the television age, arguing that our obsession with entertainment is degrading our ability to engage in serious public discourse.",
    link: "https://www.penguinrandomhouse.com/books/297276/amusing-ourselves-to-death-by-neil-postman/"
  },
  {
    title: "Community",
    author: "Peter Block",
    coverImageUrl: "/book_covers/book9.jpg",
    description: "Peter Block outlines how to build strong communities by shifting the focus from problems and leaders to the power of citizen engagement and communal accountability.",
    link: "https://www.goodreads.com/en/book/show/2774428"
  },
  {
    title: "The Book of Disquiet",
    author: "Fernando Pessoa",
    coverImageUrl: "/book_covers/book10.jpg",
    description: "A 'factless autobiography' by Portuguese poet Fernando Pessoa, full of melancholic and philosophical reflections on life and existence.",
    link: "https://www.penguinrandomhouse.com/books/286380/the-book-of-disquiet-by-fernando-pessoa-edited-and-translated-by-richard-zenith/"
  },
  {
    title: "The Scent of Time",
    author: "Byung-Chul Han",
    coverImageUrl: "/book_covers/scent_of_time.jpeg",
    description: "In his latest book, Byung-Chul Han examines the art of lingering in the context of our time-compressed digital age, arguing for a return to a more contemplative and meaningful experience of time.",
    link: "https://www.politybooks.com/bookdetail?book_slug=the-scent-of-time-a-philosophical-essay-on-the-art-of-lingering--9781509516049"
  },
  {
    title: "Gravity and Grace",
    author: "Simone Weil",
    coverImageUrl: "/book_covers/gravity_and_grace.jpeg",
    description: "First published posthumously in 1947, Gravity and Grace is a collection of Simone Weil's spiritual and philosophical aphorisms, exploring themes of suffering, detachment, and the search for the divine.",
    link: "https://www.nebraskapress.unl.edu/bison-books/9780803298002/gravity-and-grace/"
  },
  {
    title: "What Is Post-Branding?",
    author: "Jason Grant",
    coverImageUrl: "/book_covers/post_branding.jpg",
    description: "Part design experiment, part critical theory, part how-to manual, What Is Post-Branding? offers a creative counter to branding's neoliberal orthodoxy.",
    link: "https://www.artbook.com/9789083270678.html"
  },
  {
    title: "Rework",
    author: "Jason Fried & David Heinemeier Hansson",
    coverImageUrl: "/book_covers/rework.jpg",
    description: "Jason Fried and David Heinemeier Hansson challenge traditional business wisdom in Rework, offering a lean and pragmatic approach to starting and running a business.",
    link: "https://williammeller.com/rework-by-jason-fried-david-heinemeier-hansson/"
  },
  {
    title: "On the Shortness of Life",
    author: "Seneca",
    coverImageUrl: "/book_covers/shortness_of_life.jpg",
    description: "Seneca's timeless essay on the value of time and the importance of living a purposeful and intentional life, free from the distractions of ambition and leisure.",
    link: "https://www.goodreads.com/book/show/58649040-on-the-shortness-of-life"
  },
  {
    title: "Governing the Commons",
    author: "Elinor Ostrom",
    coverImageUrl: "/book_covers/governing_commons.jpg",
    description: "In this seminal work, Elinor Ostrom explores how traditional communities manage collective resources without top-down regulation or privatization, offering a powerful alternative to the 'tragedy of the commons'.",
    link: "https://www.abebooks.com/servlet/BookDetailsPL?bi=22912392178&dest=usa&ref_=ps_ms_267691761&cm_mmc=msn-_-comus_dsa-_-naa-_-naa&msclkid=796b7dc5145e1098cc261471692c291f"
  },
  {
    title: "On Photography",
    author: "Susan Sontag",
    coverImageUrl: "/book_covers/on_photography.jpg",
    description: "Susan Sontag's collection of essays examining the aesthetic and moral problems raised by the presence and authority of the photographed image in modern life.",
    link: "https://www.penguin.com.au/books/on-photography-9780141035789"
  },
  {
    title: "The Tyranny of Virtue",
    author: "Robert Boyers",
    coverImageUrl: "/book_covers/tyranny_of_virtue.jpg",
    description: "Robert Boyers examines the culture of ideological fundamentalism and the hunt for 'heresy' in contemporary academia and public discourse, calling for a return to intellectual nuance and complexity.",
    link: "https://www.goodreads.com/en/book/show/43822430-the-tyranny-of-virtue"
  },
  {
    title: "On Earth We're Briefly Gorgeous",
    author: "Ocean Vuong",
    coverImageUrl: "/book_covers/briefly_gorgeous.jpg",
    description: "A deeply moving and poetic novel written as a letter from a son to his illiterate mother, Ocean Vuong explores themes of memory, family, trauma, and the power of language.",
    link: "https://www.goodreads.com/book/show/41880609-on-earth- we-re-briefly-gorgeous"
  },
  {
    title: "No Logo",
    author: "Naomi Klein",
    coverImageUrl: "/book_covers/no_logo.jpg",
    description: "Naomi Klein's seminal work on the rise of anti-corporate activism and the impact of global branding on culture and labor.",
    link: "https://www.goodreads.com/book/show/647.No_Logo"
  },
  {
    title: "Tokens",
    author: "Rachel O'Dwyer",
    coverImageUrl: "/book_covers/tokens.jpg",
    description: "An essential guide to how digital tokens, NFTs, and crypto are redefining our social and economic landscape, often in ways that favor platforms over people.",
    link: "https://www.penguinrandomhouse.com/books/721301/tokens-by-rachel-odwyer/"
  },
  {
    title: "Momo",
    author: "Michael Ende",
    coverImageUrl: "/book_covers/momo.jpg",
    description: "A timeless fantasy about a girl who fights to save her community from the 'Men in Grey'—time thieves who rob people of their joy and leisure.",
    link: "https://www.goodreads.com/book/show/68811.Momo"
  },
  {
    title: "Vestoj",
    author: "Anja Aronowsky Cronberg",
    coverImageUrl: "/book_covers/vestoj.jpg",
    description: "A research platform and journal that examines the relationship between fashion, culture, and identity, providing a critical and intellectual perspective on why we wear what we wear.",
    link: "https://vestoj.com/about/"
  }
];

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
  const [showInfoModal, setShowInfoModal] = useState(false);
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

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Retro Mode with Shift + P
      if (e.shiftKey && e.key.toLowerCase() === 'p') {
        setIsRetroMode(prev => !prev);
        setShowGame(false); // Reset game state when toggling mode
      }
      
      // Exit everything with Escape
      if (e.key === 'Escape') {
        setShowGame(false);
        setIsRetroMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
                      <div className="crt-screen">
                        {/* Scanlines + vignette overlays */}
                        <div className="crt-scanlines" />
                        <div className="crt-vignette" />
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
                               <div className="crt-desk-icon readme-icon" onClick={() => setShowInfoModal(true)}>
                                 <div className="crt-desk-icon-img readme-file">
                                   <FileText size={24} color="#000" />
                                 </div>
                                 <span>README.txt</span>
                               </div>
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
                        {/* Taskbar */}
                        <div className="crt-taskbar">
                          <button className="crt-start-btn" onClick={() => setShowStartModal(prev => !prev)}>
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
                      <div className="crt-ctrl-btn" />
                      <div className="crt-ctrl-btn" />
                      <div className="crt-power-btn" onClick={() => { setIsRetroMode(false); setShowGame(false); }}>
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

                {showStartModal && (
                  <div className="win95-popup">
                    <div className="popup-title">
                      <span>Message</span>
                      <button className="popup-close" onClick={() => setShowStartModal(false)}>×</button>
                    </div>
                    <div className="popup-body">
                      <p>hope you are having a good day : )</p>
                      <button className="popup-ok" onClick={() => setShowStartModal(false)}>: )</button>
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
