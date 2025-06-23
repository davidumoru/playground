export default function FooterRight() {
  return (
    <div className="pointer-events-auto absolute bottom-0 right-0 p-6 text-gray-500 text-right text-sm font-medium space-y-1">
      <a
        href="mailto:hey@davidumoru.me"
        className="hover:underline transition-colors duration-150"
      >
        Contact
      </a>
      <br />
      <a
        href="https://twitter.com/theumoru"
        className="hover:underline transition-colors duration-150"
        target="_blank"
        rel="noopener noreferrer"
      >
        @theumoru
      </a>
    </div>
  );
}
