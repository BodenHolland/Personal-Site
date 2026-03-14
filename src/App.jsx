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
  ChevronLeft,
  X,
  Send
} from 'lucide-react';

const booksData = [
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

const products = [
  { name: 'Obsidian', desc: 'A note-taking tool for networked thought.', link: 'https://obsidian.md/', iconUrl: '/product_icons/obsidian.jpg' },
  { name: 'Snipd', desc: 'A podcast player that uses AI to create transcripts for podcast episodes that you can follow along as you listen.', link: 'https://www.snipd.com/', iconUrl: '/product_icons/Snipd App Icon.jpg' },
  { name: 'b.bulb', desc: 'An incredible portable light fixture designed by Ingo Maurer.', link: 'https://www.ingo-maurer.com/en/products/bbulb/', iconUrl: '/product_icons/Bulb Ingo Maur Image.jpg' },
  { name: 'Notion', desc: 'We all know this one, I have been using Notion since its early days. By now I have 50 people accessing and using my "Botion".', link: 'https://www.notion.so/', iconUrl: '/product_icons/Notion Icon.jpg' },
  { name: 'Raindrop', desc: 'A bookmarking service that lets users save, organize, and share web content.', link: 'https://raindrop.io/', iconUrl: '/product_icons/raindrop.jpg' },
  { name: 'Contour Mouse', desc: 'Really feels like you are surfing the web.', link: 'https://www.contourdesign.com/collection/contour-rollermouse', iconUrl: '/product_icons/Coutour Mouse Roller Image.jpg' },
  { name: 'Readwise', desc: 'Helps you get the most out of what you read by making it easy to revisit your highlights from all your favorite reading platforms.', link: 'https://readwise.io/', iconUrl: '/product_icons/Readwise Icon.jpg' },
  { name: 'SFPL', desc: 'As an avid reader I enjoy accessing and supporting public services such as the San Francisco Public Library.', link: 'https://sfpl.org/', iconUrl: '/product_icons/SFPL Icon.jpg' },
  { name: '3M', desc: 'One of the best at iterative development, have yet to disappoint. You have certainly used some of their products.', link: 'https://www.3m.com/', iconUrl: '/product_icons/3M Icon.jpg' },
  { name: 'Tomito', desc: 'My favorite Pomodoro timer so far.', link: 'https://tomito.app/', iconUrl: '/product_icons/Tomito Icon App.jpg' },
  { name: 'Arc', desc: 'sad to see this one on its way out. Fingers crossed they keep it around & working.', link: 'https://arc.net', iconUrl: '/product_icons/Arc App Icon.jpg' },
];

const sections = [
  { id: 'intro', label: 'Home' },
  { id: 'products', label: 'Favorite Products' },
  { id: 'reading', label: 'Reading' },
  { id: 'projects', label: 'Projects' },
  { id: 'photography', label: 'Photography' },
  { id: 'contact', label: 'Contact' }
];

function App() {
  const [activeTab, setActiveTab] = useState('intro');
  const [openedBook, setOpenedBook] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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
              Hi, I’m Boden 👋. Welcome to my personal website. I hope you find something you enjoy. Feel free to reach out anytime via the contact page!
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
                <a key={p.name} href={p.link} target="_blank" rel="noopener noreferrer" className="card product-card">
                  {p.iconUrl && (
                    <img src={p.iconUrl} alt={`${p.name} icon`} className="product-icon" />
                  )}
                  <h3 style={{ marginBottom: '1rem' }}>{p.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{p.desc}</p>
                </a>
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
                    <p className="book-title-small">{book.title}</p>
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
                I grew up working with my hands, a craft and skill I’ve come to appreciate more as time goes on. Most weekends, you’ll find me in the workshop, away from screens, building something new or repairing something old.
              </p>
            </div>
            <img 
              src="/downloaded_data/crafting/workshop.jpg" 
              alt="Workshop" 
              style={{ width: '100%', borderRadius: '8px', marginTop: '2rem' }}
            />
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
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(i => (
                <div key={i} className="full-image-container">
                  <img src={`/photos/${i}.jpg`} alt="" />
                </div>
              ))}
              <div className="full-image-container">
                <img src="/photos/16_bad_design.jpg" alt="" />
              </div>
              <div className="full-image-container">
                <img src="/photos/18_not_my_photo.jpg" alt="" />
                <div className="image-caption">
                  Last photograph, not mine. Marfa, Texas. Robert Irwin. The best of design.
                </div>
              </div>

              <div style={{ marginTop: '6rem', marginBottom: '4rem' }}>
                <p className="section-description" style={{ maxWidth: '900px' }}>
                The title of this section could have easily been Home, but for me, home is about being surrounded by nature. That’s why I live in the Presidio of San Francisco. Most days begin and end with a walk here. Our neighborhood in Fort Scott is quiet, with only a few homes. Sometimes I cross paths with a neighbor and we stop to chat; other times, there’s no one at all.
                </p>
              </div>

              {[1,2,3,4,5,6].map(i => (
                <div key={`nature-${i}`} className="full-image-container">
                  <img src={`/downloaded_data/nature/nature_${i}.jpg`} alt="" />
                </div>
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
                  <button onClick={() => setSubmitted(false)} className="submit-btn" style={{ marginTop: '2rem' }}>
                    Send another message
                  </button>
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
                  <button type="submit" className="submit-btn">
                    Send Message <Send size={18} />
                  </button>
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
        {sections.map(s => (
          <button 
            key={s.id} 
            className={`nav-link ${activeTab === s.id ? 'active' : ''}`}
            onClick={() => navigate(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <button className="hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
        <span /><span /><span />
      </button>

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
            {sections.map(s => (
              <button
                key={s.id}
                className={`nav-link ${activeTab === s.id ? 'active' : ''}`}
                onClick={() => navigate(s.id)}
              >
                {s.label}
              </button>
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
            {renderSection()}
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
