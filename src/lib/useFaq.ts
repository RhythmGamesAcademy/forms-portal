import { useState, useEffect } from "react";

export type FaqItem = {
  id: number;
  category: string;
  question: string;
  answer: string;
};

export function useFaq() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFaq = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/faq.json");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch FAQ: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        if (isMounted) {
          setFaqs(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error occurred");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFaq();

    return () => {
      isMounted = false;
    };
  }, []);

  return { faqs, isLoading, error };
}
