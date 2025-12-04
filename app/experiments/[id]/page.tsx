import { experiments } from "@/lib/experiments"
import ExperimentPageClient from "./page.client"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return experiments.map((exp) => ({
    id: exp.id,
  }))
}

export default async function ExperimentPage({ params }: Props) {
  const resolvedParams = await params
  return <ExperimentPageClient params={resolvedParams} />
}
