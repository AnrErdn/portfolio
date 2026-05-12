import Nav from '@/components/nav'
import AppShell from '@/components/app-shell'
import WorkGrid from '@/components/work-grid'
import About from '@/components/about'
import Skills from '@/components/skills'
import ShaderSection from '@/components/shader-section'
import Process from '@/components/process'
import Contact from '@/components/contact'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        {/* AppShell handles Loader → Hero state handoff */}
        <AppShell />
        <div className="scan-decorator" aria-hidden="true" />
        <WorkGrid />
        <div className="scan-decorator" aria-hidden="true" />
        <About />
        <div className="scan-decorator" aria-hidden="true" />
        <Skills />
        <div className="scan-decorator" aria-hidden="true" />
        <ShaderSection />
        <div className="scan-decorator" aria-hidden="true" />
        <Process />
        <div className="scan-decorator" aria-hidden="true" />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
