import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  BookOpen, 
  Hammer, 
  Trees, 
  Camera, 
  Mail,
  ExternalLink
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const products = [
  { name: 'Obsidian', desc: 'A note-taking tool for networked thought.', link: 'https://obsidian.md/' },
  { name: 'Snipd', desc: 'A podcast player that uses AI to create transcripts for podcast episodes that you can follow along as you listen.', link: 'https://www.snipd.com/' },
  { name: 'b.bulb', desc: 'An incredible portable light fixture designed by Ingo Maurer.', link: 'https://www.ingo-maurer.com/en/products/bbulb/' },
  { name: 'Notion', desc: 'We all know this one, I have been using Notion since its early days. By now I have 50 people accessing and using my "Botion".', link: 'https://www.notion.so/' },
  { name: 'Raindrop', desc: 'A bookmarking service that lets users save, organize, and share web content.', link: 'https://raindrop.io/' },
  { name: 'Contour Mouse', desc: 'Really feels like you are surfing the web.', link: 'https://www.contourdesign.com/collection/contour-rollermouse' },
  { name: 'Readwise', desc: 'Helps you get the most out of what you read by making it easy to revisit your highlights from all your favorite reading platforms.', link: 'https://readwise.io/' },
  { name: 'SFPL', desc: 'As an avid reader I enjoy accessing and supporting public services such as the San Francisco Public Library.', link: 'https://sfpl.org/' },
  { name: '3M', desc: 'One of the best at iterative development, have yet to disappoint. You have certainly used some of their products.', link: 'https://www.3m.com/' },
  { name: 'Tomito', desc: 'My favorite Pomodoro timer so far.', link: 'https://tomito.app/' },
  { name: 'Arc', desc: 'sad to see this one on its way out. Fingers crossed they keep it around & working.', link: 'https://arc.net' },
];

const books = [
  "Seeing Is Forgetting the Name of the Thing One Sees by Lawrence Weschler",
  "Before Forgiveness by David Konstan",
  "The Cambridge Companion to Hannah Arendt by Dana Villa",
  "A General Theory of Love by Thomas Lewis, Fari Amini, and Richard Lannon",
  "No Rules Rules by Reed Hastings and Erin Meyer",
  "Butter Honey Pig Bread by Francesca Ekwuyasi",
  "In Praise of Shadows by Junichiro Tanizaki",
  "Amusing Ourselves to Death by Neil Postman",
  "Community by Peter Block",
  "The Book of Disquiet"
];

const SectionHeader = ({ icon: Icon, title, id, subtitle }) => (
  <motion.div 
    variants={fadeInUp}
    className="section-title"
    id={id}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Icon size={32} strokeWidth={1.5} />
      <h2>{title}</h2>
    </div>
    {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>{subtitle}</p>}
  </motion.div>
);

function App() {
  return (
    <div className="container" style={{ paddingTop: '10vh' }}>
      {/* Introduction */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{ padding: '0 0 8rem 0' }}
      >
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{ fontSize: '1.8rem', maxWidth: '800px', lineHeight: '1.4' }}
        >
          Hi, I’m Boden 👋. Welcome to my personal website. I hope you find something you enjoy. Feel free to send me an email anytime!
        </motion.p>
      </motion.section>

      {/* Favorite Products */}
      <section>
        <SectionHeader icon={Package} title="Favorite Products" subtitle="Both Software & Hardware" id="products" />
        <motion.div 
          className="grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((p) => (
            <motion.div key={p.name} variants={fadeInUp} className="glass card">
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="card-link">
                <ExternalLink size={16} />
              </a>
            </motion.div>
          ))}
          <motion.div variants={fadeInUp} className="glass card" style={{ justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed' }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>+ Many more.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Reading */}
      <section>
        <SectionHeader icon={BookOpen} title="Reading" id="reading" />
        <motion.p 
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          style={{ marginBottom: '3rem', fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '800px' }}
        >
          I am an avid reader, primarily focused on philosophy, psychology, research, and articles. Luckily, I have people in my life who balance this dense materials with the enjoyable art of fiction and poetry.
        </motion.p>
        <motion.p variants={fadeInUp} initial="initial" whileInView="animate" style={{ marginBottom: '2rem' }}>
          A handful of recent favorites include:
        </motion.p>
        <motion.div 
          className="grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {books.map((b) => (
            <motion.div key={b} variants={fadeInUp} className="glass card">
              <p style={{ color: 'var(--text-main)', fontStyle: 'italic' }}>{b}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Crafting */}
      <section>
        <SectionHeader icon={Hammer} title="Crafting" id="crafting" />
        <motion.div 
          className="glass card" 
          style={{ padding: 0, overflow: 'hidden', marginBottom: '4rem' }}
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', minHeight: '400px' }}>
            <div style={{ padding: '4rem' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
                I grew up working with my hands, a craft and skill I’ve come to appreciate more as time goes on. Most weekends, you’ll find me in the workshop, away from screens, building something new or repairing something old.
              </p>
            </div>
            <div className="image-item" style={{ borderRadius: 0 }}>
              <img src="/downloaded_data/crafting/workshop.jpg" alt="Workshop" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Nature */}
      <section>
        <SectionHeader icon={Trees} title="Nature" id="nature" />
        <motion.p 
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          style={{ marginBottom: '2rem', fontSize: '1.2rem', color: 'var(--text-main)', maxWidth: '900px' }}
        >
          The title of this section could have easily been Home, but for me, home is about being surrounded by nature. That’s why I live in the Presidio of San Francisco. When I step out my back door, I’m already among the trees, birds, and dirt. Most days begin and end with a walk here. Our neighborhood in Fort Scott is quiet, with only a few homes. Sometimes I cross paths with a neighbor and we stop to chat; other times, there’s no one at all.
        </motion.p>
        <motion.p 
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          style={{ marginBottom: '3rem', color: 'var(--text-muted)' }}
        >
           All the photographs in this section were taken within a fifteen-minute walk from home
        </motion.p>
        <motion.div 
          className="image-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[1,2,3,4,5,6].map(i => (
            <motion.div key={i} variants={fadeInUp} className="image-item glass">
              <img src={`/downloaded_data/nature/nature_${i}.jpg`} alt="" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Photography */}
      <section>
        <SectionHeader icon={Camera} title="Photography" id="photography" />
        <motion.div 
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          style={{ marginBottom: '4rem' }}
        >
          <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '2rem', maxWidth: '800px' }}>
            My first real hobby was photography. I’ve always been drawn to light and its changing qualities. It forces me to slow down and pay attention to what’s around me. Photography is a way of communicating—sharing what we notice, what we’re drawn to, and what we’re trying to hold onto.
          </p>
          <blockquote style={{ fontSize: '1.8rem', borderLeft: '4px solid var(--accent-photo)', paddingLeft: '2rem', fontStyle: 'italic', marginBottom: '1rem' }}>
            "The camera is an instrument that teaches people how to see without a camera."
          </blockquote>
          <cite style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>— Dorothea Lange</cite>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '4rem', maxWidth: '800px' }}>
            In 2022 I went to Marfa to see Robert Irwin’s Untitled (dawn to dusk). It was a transformative experience. I arrived at dawn and stayed until dusk, watching how the light moved across the space and changed everything it touched.
          </p>
        </motion.div>
        
        <motion.div 
          className="image-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[1,2,3,4].map(i => (
            <motion.div key={i} variants={fadeInUp} className="image-item glass">
              <img src={`/downloaded_data/photography/photo_${i}.jpg`} alt="" />
            </motion.div>
          ))}
          <motion.div variants={fadeInUp} className="image-item glass">
            <img src="/downloaded_data/photography/marfa_design.jpg" alt="" />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', padding: '1rem', backdropFilter: 'blur(5px)' }}>
              <p style={{ color: '#fff', fontSize: '0.8rem' }}>Last photograph, not mine. Marfa, Texas. Robert Irwin. The best of design.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '6rem 0', borderTop: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <a href="mailto:hello@bodenholland.com" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Mail size={20} /> hello@bodenholland.com
        </a>
      </footer>
    </div>
  );
}

export default App;
