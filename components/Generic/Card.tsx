export default function Card({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col justify-start gap-3 m-6 spacegradient p-8 shadow-high rounded-2xl h-min">
      {children}
    </div>
  )
}