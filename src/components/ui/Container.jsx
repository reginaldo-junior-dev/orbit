import { cx } from '../../lib/cx'

export default function Container({ as: Tag = 'div', className, children }) {
  return (
    <Tag className={cx('mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10', className)}>
      {children}
    </Tag>
  )
}
