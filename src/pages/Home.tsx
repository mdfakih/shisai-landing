import { Hero } from '@/components/home/Hero';
import { StandardsStrip } from '@/components/home/StandardsStrip';
import { Industries } from '@/components/home/Industries';
import { JointAnatomy } from '@/components/home/JointAnatomy';
import { ProductFamilies } from '@/components/home/ProductFamilies';
import { Capabilities } from '@/components/home/Capabilities';
import { QualityStrip } from '@/components/home/QualityStrip';
import { CtaBand } from '@/components/home/CtaBand';

const Home = () => (
  <>
    <Hero />
    <StandardsStrip />
    <Industries />
    <JointAnatomy />
    <ProductFamilies />
    <Capabilities />
    <QualityStrip />
    <CtaBand />
  </>
);

export default Home;
