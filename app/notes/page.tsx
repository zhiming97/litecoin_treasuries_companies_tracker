// import { createClient } from '@/utils/supabase/server'

// export default async function Page() {
//   const supabase = await createClient()
//   const { data: notes } = await supabase.from('notes').select()

//   return <pre>{JSON.stringify(notes, null, 2)}</pre>
// }

// Example using the pages router
'use client';

import { useState } from 'react';

function FAQPage() {
  const faqData = [
    {
      question: "What are the features of MEOWMARKET ?",
      answer: "MEOWMARKET is a platform where users can log in and view the stats which is stored in the database.",
    },
    {
      question: "Can users input their own stats?",
      answer: "Yes. They can input their own stats and view them in the stats page.",
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      <div className="space-y-6 w-full">
        {faqData.map((item, index) => (
          <div key={index} className="border rounded-lg p-6 w-full bg-card">
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              {item.question}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQPage;
