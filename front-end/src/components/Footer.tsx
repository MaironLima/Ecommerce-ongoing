function Footer() {
  return (
    <footer className="bg-violet-500 w-full py-6 flex flex-col items-center space-y-2 text-white relative">
      <div className="flex space-x-4 text-sm">
        <span>About Us</span>
        <span>Privacy Policy</span>
        <span>Terms & Conditions</span>
        <span>Returns & Refunds</span>
      </div>
      <div className="text-xs opacity-80">
        Phone: (84) 90000-0000 &nbsp;|&nbsp; Email: support@store.com &nbsp;|&nbsp; Hours: 8 AM - 6 PM
      </div>
      <div className="text-xs opacity-60 absolute bottom-2 left-1/2 -translate-x-1/2">
        © 2025 My Store — All rights reserved.
      </div>
    </footer>
  )
}

export default Footer