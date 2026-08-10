import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}
['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, index) => (
  <div key={index}>{d}</div>
))