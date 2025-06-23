import Link from "next/link";
import { projects } from "./projects";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-2">
      <ul className="w-full max-w-2xl space-y-3">
        {projects.map((project) => (
          <li key={project.url}>
            <Link
              href={project.url}
              className="block p-4 md:p-5 rounded border border-gray-100 bg-gray-50 text-left transition-colors duration-150 hover:bg-gray-100 focus:bg-gray-100 outline-none"
            >
              <span className="font-bold text-gray-900">{project.name}</span>
              <span className="block text-gray-500 text-sm">
                {project.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
