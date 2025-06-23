const links = [
  {
    href: "https://davidumoru.me",
    label: "Main Site",
  },
  {
    href: "https://github.com/davidumoru",
    label: "GitHub",
  },
];

export default function NavLinks() {
  return (
    <nav className="absolute top-0 right-0 p-6 flex gap-6 text-gray-700 text-base font-medium">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="hover:underline transition-colors duration-150"
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
