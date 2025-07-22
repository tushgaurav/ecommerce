import { Star } from 'lucide-react'

function Reviews() {
    return (
        <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
            <ul className="space-y-6">
                {dummyReviews.map((review) => (
                    <li key={review.id} className="bg-muted rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-base">{review.name}</span>
                            <span className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`size-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                                ))}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export { Reviews }

// --- Static content and interfaces ---

interface Review {
    id: string
    name: string
    rating: number
    comment: string
}

const dummyReviews: Review[] = [
    {
        id: '1',
        name: 'Alice',
        rating: 5,
        comment: 'Fantastic product! Exceeded my expectations.'
    },
    {
        id: '2',
        name: 'Bob',
        rating: 4,
        comment: 'Very good quality, but shipping was a bit slow.'
    },
    {
        id: '3',
        name: 'Charlie',
        rating: 3,
        comment: 'Average experience. The product is okay for the price.'
    }
] 