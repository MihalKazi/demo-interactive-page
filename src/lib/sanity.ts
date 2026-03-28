import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'wgub6z15', // <-- PASTE YOUR ID HERE
  dataset: 'production',
  apiVersion: '2026-03-28', // Use today's date
  useCdn: false, // Set to false so changes show up instantly!
})