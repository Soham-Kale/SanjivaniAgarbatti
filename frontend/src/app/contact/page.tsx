import type { Metadata } from 'next';
import SectionHead from '@/components/SectionHead';
import EnquiryForm from '@/components/EnquiryForm';
import ContactCards from '@/components/ContactCards';
import T from '@/components/T';

export const metadata: Metadata = {
  title: 'संपर्क व डीलर चौकशी',
  description: 'संजीवनी अगरबत्ती, माळेवाडी-अकलूज. फोन, WhatsApp, पत्ता आणि डीलर / होलसेल चौकशी.',
};

export default function ContactPage() {
  return (
    <>
      <section className="section wrap pt-16">
        <SectionHead
          as="h1"
          eyebrow={{ mr: 'संपर्क', en: 'Contact' }}
          title={{ mr: 'आम्ही तुमच्या सेवेत', en: 'We are here to help' }}
          text={{ mr: 'ऑर्डर, होलसेल दर किंवा फ्रँचायझीसाठी कधीही संपर्क करा.', en: 'Get in touch for orders, wholesale rates or franchise.' }}
        />
        <ContactCards />
      </section>
      <section className="wrap pb-24">
        <div id="dealer" className="grid scroll-mt-24 gap-10 rounded-3xl border border-line bg-ink-2 p-6 md:grid-cols-[1fr_1.2fr] md:p-10">
          <div>
            <div className="eyebrow"><T mr="डीलर / होलसेल चौकशी" en="Dealer / wholesale enquiry" /></div>
            <h2 className="mt-2.5 text-[2rem]"><T mr="दुकानदार आहात? होलसेल दरासाठी संपर्क करा" en="Own a shop? Ask for wholesale rates" /></h2>
            <p className="text-muted">
              <T
                mr="अगरबत्ती, धूप, कप धूप आणि पूजा साहित्याची संपूर्ण रेंज होलसेल दरात. फॉर्म भरा, आम्ही दरपत्रक पाठवू."
                en="The full range of agarbatti, dhoop, cup dhoop and puja sahitya at wholesale rates. Fill the form and we will send our rate list."
              />
            </p>
          </div>
          <EnquiryForm type="dealer" />
        </div>
      </section>
    </>
  );
}
