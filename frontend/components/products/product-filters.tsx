import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export function ProductFilters() {
    const [open, setOpen] = useState(false)

    // Sidebar for desktop, Dialog for mobile
    return (
        <>
            <div className="lg:hidden mb-4 ">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <button className="w-full px-4 py-2 rounded bg-muted font-medium border border-border">More Filters</button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Filters</h2>
                        <FilterAccordion />
                        <button className="mt-6 w-full px-4 py-2 rounded bg-primary text-primary-foreground font-semibold" onClick={() => setOpen(false)}>Apply Filters</button>
                    </DialogContent>
                </Dialog>
            </div>
            {/* Desktop: Sidebar Accordion */}
            <aside className="hidden lg:block w-64 bg-muted/40 rounded-lg p-6 mb-6 lg:mb-0 lg:mr-8 border border-border flex-shrink-0">
                <h2 className="text-2xl font-bold mb-6 tracking-tight">Filter:</h2>
                <FilterAccordion />
            </aside>
        </>
    )
}

function FilterAccordion() {
    return (
        <Accordion type="multiple" className="space-y-2">
            <AccordionItem value="availability">
                <AccordionTrigger>Availability</AccordionTrigger>
                <AccordionContent>
                    <div className="flex items-center gap-2 mt-2">
                        <Checkbox id="in-stock" />
                        <Label htmlFor="in-stock" className="text-sm">In stock (40)</Label>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price">
                <AccordionTrigger>Price</AccordionTrigger>
                <AccordionContent>
                    <div className="flex gap-2 mt-2">
                        <input type="number" placeholder="Min" className="w-20 rounded border px-2 py-1 text-sm bg-background" />
                        <span className="text-muted-foreground">-</span>
                        <input type="number" placeholder="Max" className="w-20 rounded border px-2 py-1 text-sm bg-background" />
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="gear-type">
                <AccordionTrigger>Gear Type</AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-col gap-1 mt-2">
                        <Checkbox id="gear1" /> <Label htmlFor="gear1" className="text-sm">Type 1</Label>
                        <Checkbox id="gear2" /> <Label htmlFor="gear2" className="text-sm">Type 2</Label>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="gender">
                <AccordionTrigger>Gender</AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-col gap-1 mt-2">
                        <Checkbox id="male" /> <Label htmlFor="male" className="text-sm">Male</Label>
                        <Checkbox id="female" /> <Label htmlFor="female" className="text-sm">Female</Label>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="color">
                <AccordionTrigger>Color</AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <button className="w-6 h-6 rounded-full bg-red-500 border-2 border-border" aria-label="Red" />
                        <button className="w-6 h-6 rounded-full bg-blue-500 border-2 border-border" aria-label="Blue" />
                        <button className="w-6 h-6 rounded-full bg-green-500 border-2 border-border" aria-label="Green" />
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="size">
                <AccordionTrigger>Size</AccordionTrigger>
                <AccordionContent>
                    <div className="flex gap-2 flex-wrap mt-2">
                        <button className="px-3 py-1 rounded border text-sm bg-background">S</button>
                        <button className="px-3 py-1 rounded border text-sm bg-background">M</button>
                        <button className="px-3 py-1 rounded border text-sm bg-background">L</button>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

// Interfaces (if needed) can be added here 