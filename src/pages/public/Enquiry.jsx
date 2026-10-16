import React from 'react'
import EnquiryForm from '../../components/forms/EnquiryForm'

export default function Enquiry() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-semibold text-slate-900">Admission enquiry</h1>
      <p className="mt-2 mb-8 text-slate-600">
        Fill in the form and the admission office will call you with details about trades, eligibility and fees.
      </p>
      <EnquiryForm />
    </section>
  )
}