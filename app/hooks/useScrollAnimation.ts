import { useEffect, useRef } from 'react';

export const useScrollAnimation = () => {
  const formSectionRef = useRef<HTMLElement>(null);
  const bookingCardRef = useRef<HTMLDivElement>(null);
  const formGroupsRef = useRef<HTMLDivElement[]>([]);
  const radioGroupRef = useRef<HTMLDivElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger animations when form section comes into view
            if (entry.target === formSectionRef.current) {
              entry.target.classList.add('animate');
              
              // Animate booking card
              if (bookingCardRef.current) {
                setTimeout(() => {
                  bookingCardRef.current?.classList.add('animate');
                }, 200);
              }
              
              // Animate form groups
              formGroupsRef.current.forEach((group, index) => {
                if (group) {
                  setTimeout(() => {
                    group.classList.add('animate');
                  }, 300 + (index * 100));
                }
              });
              
              // Animate radio group
              if (radioGroupRef.current) {
                setTimeout(() => {
                  radioGroupRef.current?.classList.add('animate');
                }, 600);
              }
              
              // Animate submit button
              if (submitBtnRef.current) {
                setTimeout(() => {
                  submitBtnRef.current?.classList.add('animate');
                }, 1100);
              }
            }
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element is fully in view
      }
    );

    if (formSectionRef.current) {
      observer.observe(formSectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    formSectionRef,
    bookingCardRef,
    formGroupsRef,
    radioGroupRef,
    submitBtnRef
  };
};
