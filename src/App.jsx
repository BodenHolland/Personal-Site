import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronLeft,
  ChevronRight,
  Scale
} from 'lucide-react';

const booksData = [
  {
    title: "Vestoj",
    author: "Anja Aronowsky Cronberg",
    coverImageUrl: "/book_covers/vestoj.jpg",
    description: "A research platform and journal that examines the relationship between fashion, culture, and identity, providing a critical and intellectual perspective on why we wear what we wear.",
    link: "https://vestoj.com/about/"
  },
  {
    title: "Seeing Is Forgetting the Name of the Thing One Sees",
    author: "Lawrence Weschler",
    coverImageUrl: "/book_covers/book1.jpg",
    description: "A fascinating biography of artist Robert Irwin, tracing his journey from abstract expressionist painter to a pioneer of site-specific light and space installations.",
    link: "https://www.ucpress.edu/book/9780520256095/seeing-is-forgetting-the-name-of-the-thing-one-sees"
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
  }
];

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
      "/light_projects/experiments in gradient difraction/unnamed-2.jpg",
      "/light_projects/experiments in gradient difraction/unnamed-2.png",
      "/light_projects/experiments in gradient difraction/unnamed.png"
    ]
  },
  {
    title: "Fire Extinguisher Light",
    description: "A fully functional fire extinguisher light fixture. I worked with a specially painter down in LA after diving way too deep into the world of Lumilor. A conductive paint capable of producing light.",
    images: [
      "/light_projects/fire extinguisher light/unnamed.jpg",
      "/light_projects/fire extinguisher light/unnamed.png"
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
  }
];

const products = [
  { name: 'Obsidian', desc: 'A note-taking tool for networked thought.', link: 'https://obsidian.md/', iconUrl: '/product_icons/obsidian.jpg' },
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
    id: 'lightfixtures',
    title: 'Light Fixtures',
    subtitle: 'Art of Light & Space',
    description: 'The art of light and space is my favorite medium. I spend much of my time experimenting and having fun building objects in our workshop. Having a workshop behind our house is a luxury of space that is rare and much appreciated in the city.',
    icon: <Lightbulb size={32} />,
    color: '#eab308',
    image: '/downloaded_data/crafting/workshop.jpg',
    links: [],
    ctaLabel: 'See more fixtures'
  }
];

const photographyData = [
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(i => ({ src: `/photos/${i}.jpg`, alt: "" })),
  { src: "/photos/16_bad_design.jpg", alt: "Bad design" },
  { src: "/photos/18_not_my_photo.jpg", alt: "Marfa, Texas. Robert Irwin. The best of design." },
  ...[1,2,3,4,5,6].map(i => ({ src: `/downloaded_data/nature/nature_${i}.jpg`, alt: "" }))
];

const sections = [
  { id: 'intro', label: 'Welcome' },
  { id: 'products', label: 'Essentials' },
  { id: 'reading', label: 'Library' },
  { id: 'projects', label: 'Experiments' },
  { id: 'light-fixtures', label: 'Light Fixtures', hidden: true },
  { id: 'photography', label: 'Photography' },
  { id: 'contact', label: 'Reach Out' }
];

function App() {
  const [activeTab, setActiveTab] = useState('intro');
  const [openedBook, setOpenedBook] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

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
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="section-content"
          >
            <p className="intro-text">
              Hi, I’m Boden 👋. Welcome to my personal website. This is where I share what I’m working on outside of my life as a PM. If you’re looking for the professional side of things, feel free to head over to my <a href="https://www.linkedin.com/in/boden-holland/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textDecorationThickness: '0.5px', textUnderlineOffset: '4px', fontWeight: 300 }}>LinkedIn</a>. I hope you find something you enjoy here, and please don’t hesitate to reach out!
            </p>
          </motion.div>
        );
      case 'products':
        return (
          <div className="section-content">
            <div className="section-head">
              <h2>Favorite Products</h2>
              <p style={{ color: 'var(--text-muted)' }}>Both Software & Hardware</p>
            </div>
            <div className="grid">
              {products.map(p => (
                <motion.a 
                  key={p.name} 
                  href={p.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="card product-card"
                  whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                >
                  {p.iconUrl && (
                    <img src={p.iconUrl} alt={`${p.name} icon`} className="product-icon" />
                  )}
                  <h3 style={{ marginBottom: '1rem' }}>{p.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{p.desc}</p>
                </motion.a>
              ))}
            </div>
          </div>
        );
      case 'reading':
        return (
          <div className="section-content">
            <div className="section-head">
              <h2>Reading</h2>
              <p className="section-description">
                I am an avid reader, primarily focused on philosophy, psychology, research, and articles. 
                Luckily, I have people in my life who balance this dense materials with the enjoyable art of fiction and poetry.
              </p>
            </div>
            <div className="books-shelf">
              {booksData.map(book => {
                const isOpened = openedBook?.title === book.title;
                return (
                  <motion.div 
                    layoutId={`book-container-${book.title}`}
                    key={book.title} 
                    className="book-container"
                    onClick={() => setOpenedBook(book)}
                    style={{ opacity: isOpened ? 0 : 1 }} // Hide original when opened to preserve space
                    whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                  >
                    <div className="book-3d-wrapper">
                      {/* Book Body (Pages) */}
                      <div className="book-pages"></div>

                      {/* Front Cover (Hinge) */}
                      <motion.div 
                        className="book-hinge"
                        style={{ originX: 0 }}
                      >
                        <div 
                          className="book-cover-front" 
                          style={{ 
                            backgroundImage: `url(${book.coverImageUrl})`,
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

            {/* Overlay for opened book */}
            <AnimatePresence>
              {openedBook && (
                <div className="book-overlay-container">
                  <motion.div 
                    className="book-overlay-bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setOpenedBook(null)}
                  >
                    <button className="overlay-close-btn" onClick={(e) => {
                      e.stopPropagation();
                      setOpenedBook(null);
                    }}>
                      <X size={32} />
                    </button>
                  </motion.div>
                  
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

                      {/* 3. Inside Content - RENDERED LAST TO ENSURE CLICKABILITY */}
                      <div className="book-inside-page">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                          className="inside-content"
                        >
                          <h3>{openedBook.title}</h3>
                          <p className="author">by {openedBook.author}</p>
                          <p className="desc">{openedBook.description}</p>
                          <div className="read-more-container">
                            <a href={openedBook.link} target="_blank" rel="noopener noreferrer" className="read-more-btn">
                              Read More <ExternalLink size={14} style={{ marginLeft: '0.4rem' }}/>
                            </a>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      case 'projects':
        return (
          <div className="section-content">
            <div className="section-head">
              <h2>Projects</h2>
              <p className="section-description">
                A collection of tools and platforms I've built to solve real-world problems and bring more transparency to complex systems.
              </p>
            </div>
            <div className="projects-grid">
              {projectsData.map(project => (
                <motion.div 
                  key={project.id} 
                  className="project-card"
                  whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                >
                  {project.image && (
                    <div className="project-card-image">
                      <img src={project.image} alt={project.title} />
                      <div className="project-card-overlay" style={{ '--project-color': project.color }}></div>
                    </div>
                  )}
                  <div className="project-card-content">
                    <div className="project-card-header">
                      <div className={`project-icon-wrapper project-icon-${project.id}`} style={{ '--project-color': project.color }}>
                        {project.icon}
                      </div>
                      <div className="project-meta">
                        <h3>{project.title}</h3>
                        <span className="project-subtitle">{project.subtitle}</span>
                      </div>
                    </div>
                    <div className="project-card-body">
                      <p>{project.description}</p>
                    </div>
                    <div className="project-card-footer">
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
                      {project.links.map(link => (
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
                <ChevronLeft size={20} /> Back to Projects
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
              <p className="section-description">
                My first real hobby was photography. I’ve always been drawn to light and its changing qualities.
              </p>
            </div>
            <blockquote style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)', fontStyle: 'italic', marginBottom: '3rem', paddingLeft: '2rem', borderLeft: '4px solid #eee' }}>
              "The camera is an instrument that teaches people how to see without a camera."
              <footer style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>— Dorothea Lange</footer>
            </blockquote>
            <div className="photography-stack">
              {photographyData.slice(0, 15).map((photo, i) => (
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
                onClick={() => setSelectedPhoto(photographyData[15])}
                whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
              >
                <img src={photographyData[15].src} alt={photographyData[15].alt} />
              </motion.div>
              <motion.div 
                className="photo-item-container" 
                onClick={() => setSelectedPhoto(photographyData[16])}
                whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
              >
                <img src={photographyData[16].src} alt={photographyData[16].alt} />
                <div className="image-caption">
                  Last photograph, not mine. Marfa, Texas. Robert Irwin. The best of design.
                </div>
              </motion.div>

              <div style={{ marginTop: '8rem', marginBottom: '2rem' }}>
                <p className="section-description">
                The following images were taken within a 15min walk from home. Most days begin and end with a walk here. Our neighborhood in Fort Scott is quiet, with only a few houses on the street. Sometimes I cross paths with a neighbor, and we stop to chat; other times, there’s no one at all.
                </p>
              </div>

              {photographyData.slice(17).map((photo, i) => (
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
              <h2>Contact</h2>
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
