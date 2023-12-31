type SidebarProps = {
  children: JSX.Element;
};

export default function Sidebar({ children }: SidebarProps) {
  return (
    <aside className='fixed left-0 z-50 w-1/6 bg-gray-800 text-white min-h-screen p-5'>
      <h1 className='flex justify-center m-10'>NW3 Demo</h1>
      {children}
    </aside>
  );
}
