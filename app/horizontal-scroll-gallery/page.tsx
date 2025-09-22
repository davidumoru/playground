'use client'
import { useScroll, useTransform, motion } from 'framer-motion';
import Lenis from 'lenis';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

const imageUrls = [
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1575&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/uploads/1411400493228e06a6315/ad711a20?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/uploads/1412026095116d2b0c90e/3bf33993?q=80&w=1467&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1429704658776-3d38c9990511?q=80&w=1979&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1682687220499-d9c06b872eee?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1421930866250-aa0594cea05c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODh8fGxhbmRzY2FwZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1502786129293-79981df4e689?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODZ8fGxhbmRzY2FwZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTJ8fGxhbmRzY2FwZXxlbnwwfHwwfHx8MA%3D%3D"
];

interface SlideProps {
  images: string[];
  direction: 'left' | 'right';
  left: string;
  progress: any;
}

interface ImageRowProps {
  images: string[];
}

export default function ScrollGallery() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  });

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="overflow-hidden">
      <div className='h-[100vh]'/>
      <div ref={container} className="space-y-16">
        <Slide 
          images={imageUrls.slice(0, 6)} 
          direction={'left'} 
          left={"-40%"} 
          progress={scrollYProgress}
        />
        <Slide 
          images={imageUrls.slice(6, 12)} 
          direction={'right'} 
          left={"-25%"} 
          progress={scrollYProgress}
        />
        <Slide 
          images={imageUrls.slice(12, 18)} 
          direction={'left'}  
          left={"-75%"} 
          progress={scrollYProgress}
        />
      </div>
      <div className='h-[100vh]' />
    </main>
  );
}

const Slide: React.FC<SlideProps> = (props) => {
  const direction = props.direction === 'left' ? -1 : 1;
  const translateX = useTransform(props.progress, [0, 1], [150 * direction, -150 * direction]);
  
  return (
    <motion.div 
      style={{x: translateX, left: props.left}} 
      className="relative flex whitespace-nowrap py-4"
    >
      <ImageRow images={props.images}/>
      <ImageRow images={props.images}/>
      <ImageRow images={props.images}/>
    </motion.div>
  );
};

const ImageRow: React.FC<ImageRowProps> = ({images}) => {
  return (
    <div className={'px-6 flex gap-6 items-center'}>
      {images.map((imageUrl, index) => (
        <div 
          key={index}
          className="relative h-[200px] w-[300px] overflow-hidden flex-shrink-0 hover:scale-105 transition-all duration-500 ease-out bg-gray-100"
        >
          <Image 
            style={{objectFit: "cover"}} 
            src={imageUrl} 
            alt={`Design engineering portfolio image ${index + 1}`} 
            fill
            sizes="300px"
            className="transition-all duration-500 hover:brightness-110"
            priority={index < 3}
          />
        </div>
      ))}
    </div>
  );
};