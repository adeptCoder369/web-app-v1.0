import { HiChevronRight } from 'react-icons/hi';
//====================================================================
export const Breadcrumbs = ({ items }) => (
  <nav aria-label="breadcrumb" className="mb-8">
    <ol className="flex items-center space-x-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          {index > 0 && (
            <HiChevronRight className="text-[var(--color-neutral-500)] w-4 h-4" />
          )}

          {item.href ? (
            <a
              href={item.href}
              className="text-[var(--color-text-secondary)] w-full hover:text-[var(--color-accent)] hover:underline transition-colors duration-300"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-[var(--color-text-primary)] font-semibold w-full">
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);