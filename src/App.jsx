import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  BookOpen, 
  Hammer, 
  Trees, 
  Camera, 
  ArrowUpRight, 
  Github, 
  Mail,
  ExternalLink,
  ChevronRight
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
  { name: 'Snipd', desc: 'AI-powered podcast player for deep learning.', link: 'https://www.snipd.com/' },
  { name: 'b.bulb', desc: 'Inspirational light by Ingo Maurer.', link: 'https://www.ingo-maurer.com/en/products/bbulb/' },
  { name: 'Notion', desc: 'Versatile workspace for projects and life.', link: 'https://www.notion.so/' },
  { name: 'Raindrop', desc: 'The best-in-class bookmarking service.', link: 'https://raindrop.io/' },
  { name: 'Contour Mouse', desc: 'Ergonomic precision for daily surfing.', link: 'https://www.contourdesign.com/collection/contour-rollermouse' },
  { name: 'Readwise', desc: 'Managing highlights and remembering what you read.', link: 'https://readwise.io/' },
  { name: 'Arc', desc: 'A browser focused on the user experience.', link: 'https://arc.net' },
];

const books = [
  { title: 'Seeing Is Forgetting the Name of the Thing One Sees', author: 'Lawrence Weschler' },
  { title: 'Before Forgiveness', author: 'David Konstan' },
  { title: 'The Cambridge Companion to Hannah Arendt', author: 'Dana Villa' },
  { title: 'Amusing Ourselves to Death', author: 'Neil Postman' },
  { title: 'Community', author: 'Peter Block' },
  { title: 'The Book of Disquiet', author: 'Fernando Pessoa' },
];

const SectionHeader = ({ icon: Icon, title, id }) => (
  <motion.div 
    variants={fadeInUp}
    className="section-title"
    id={id}
  >
    <Icon size={32} strokeWidth={1.5} />
    <h2>{title}</h2>
  </motion.div>
);

function App() {
  return (
    <div className="container">
      {/* Hero Section */}
      <motion.header 
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          Boden Holland
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          An intersection of nature, craftsmanship, and the exploration of thought.
        </motion.p>
      </motion.header>

      {/* Favorite Products */}
      <section>
        <SectionHeader icon={Package} title="Favorite Products" id="products" />
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
                Explore <ArrowUpRight size={16} />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Reading */}
      <section>
        <SectionHeader icon={BookOpen} title="Reading" id="reading" />
        <motion.div 
          className="grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {books.map((b) => (
            <motion.div key={b.title} variants={fadeInUp} className="glass card">
              <h3>{b.title}</h3>
              <p>By {b.author}</p>
              <div className="card-link">Recommended</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Crafting */}
      <section>
        <SectionHeader icon={Hammer} title="Craftsmanship" id="crafting" />
        <motion.div 
          className="glass card" 
          style={{ padding: 0, overflow: 'hidden', marginBottom: '4rem' }}
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '400px' }}>
            <div style={{ padding: '4rem' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>The Workshop</h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                I grew up working with my hands, a craft and skill I've come to appreciate more as time goes on. 
                Most weekends, you'll find me in the workshop, away from screens, building something new or repairing something old.
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
        <SectionHeader icon={Trees} title="Nature & Life" id="nature" />
        <motion.p 
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          style={{ marginBottom: '3rem', fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '800px' }}
        >
          Home is about being surrounded by nature. Living in the Presidio of San Francisco (Fort Scott) 
          allows me to be within a fifteen-minute walk of these serene landscapes.
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
              <img src={`/downloaded_data/nature/nature_${i}.jpg`} alt={`Presidio ${i}`} />
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
          <blockquote style={{ fontSize: '1.8rem', borderLeft: '4px solid var(--accent-photo)', paddingLeft: '2rem', fontStyle: 'italic', marginBottom: '1rem' }}>
            "The camera is an instrument that teaches people how to see without a camera."
          </blockquote>
          <cite style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>― Dorothea Lange</cite>
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
              <img src={`/downloaded_data/photography/photo_${i}.jpg`} alt={`Photography ${i}`} />
            </motion.div>
          ))}
          <motion.div variants={fadeInUp} className="image-item glass">
            <img src="/downloaded_data/photography/marfa_design.jpg" alt="Marfa Design" />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', padding: '1rem', backdropFilter: 'blur(5px)' }}>
              <p style={{ color: '#fff', fontSize: '0.8rem' }}>Robert Irwin's Design in Marfa, Texas</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '6rem 0', borderTop: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: var(--text-muted) }}>© {new Date().getFullYear()} Boden Holland</p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="mailto:hello@bodenholland.com" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}><Mail size={20} /></a>
          <a href="https://github.com/bodenh" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}><Github size={20} /></a>
        </div>
      </footer>
    </div>
  );
}

export default App;
