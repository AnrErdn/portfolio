import Nav from '@/components/nav'
import Hero from '@/components/hero'
import WorkGrid from '@/components/work-grid'
import About from '@/components/about'
import Skills from '@/components/skills'
import Process from '@/components/process'
import Contact from '@/components/contact'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <div className="scan-decorator" aria-hidden="true" />
        <WorkGrid />
        <div className="scan-decorator" aria-hidden="true" />
        <About />
        <div className="scan-decorator" aria-hidden="true" />
        <Skills />
        <div className="scan-decorator" aria-hidden="true" />
        <Process />
        <div className="scan-decorator" aria-hidden="true" />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
