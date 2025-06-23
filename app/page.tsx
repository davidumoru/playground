import Link from "next/link";
import { projects } from "./projects";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <ul className="w-full max-w-2xl space-y-2">
        {projects.map((project) => (
          <li key={project.url}>
            <Link
              href={project.url}
              className="block rounded border border-gray-200 bg-white px-4 py-3 transition
                hover:bg-gray-50 focus:bg-gray-50 outline-none focus-visible:ring-1 focus-visible:ring-gray-200"
            >
              <span className="font-medium text-gray-900">{project.name}</span>
              <span className="block text-gray-500 text-sm mt-0.5">
                {project.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
