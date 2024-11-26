import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function CourseCardSkeleton(){

    return<Card className="bg-gray-800 border-gray-700">
      <Skeleton className="w-full h-48 bg-gray-700" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4 bg-gray-700" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full bg-gray-700 mb-2" />
        <Skeleton className="h-4 w-full bg-gray-700 mb-2" />
        <Skeleton className="h-4 w-1/2 bg-gray-700 mb-4" />
        <Skeleton className="h-8 w-1/4 bg-gray-700" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-10 w-1/3 bg-gray-700" />
        <Skeleton className="h-10 w-1/3 bg-gray-700" />
      </CardFooter>
    </Card>
}