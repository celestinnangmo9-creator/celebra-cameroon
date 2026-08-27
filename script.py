import re
import sys

def process():
    path = r'c:\Users\celestin\.gemini\antigravity-ide\scratch\celebra-cameroon\resources\js\Layouts\AuthenticatedLayout.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Step 1: Create SidebarContent
    # we need to extract from '<div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-center">'
    # down to the end of '</aside>' (exclusive of aside tag)
    
    sidebar_match = re.search(r'(<div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-center">.*?)(\s*</aside>)', content, re.DOTALL)
    if not sidebar_match:
        print("Could not find sidebar content")
        return
        
    sidebar_inner = sidebar_match.group(1)
    
    # Define SidebarContent component
    sidebar_component = """function SidebarContent({ user, auth, totalUnread, t }) {
    return (
        <>
            """ + sidebar_inner.strip() + """
        </>
    );
}
"""
    
    # insert after SidebarItem function
    content = re.sub(r'(function SidebarItem.*?\n}\n)', r'\1\n' + sidebar_component + '\n', content, flags=re.DOTALL)
    
    # replace the inner aside with <SidebarContent />
    content = re.sub(
        r'<aside className="hidden md:flex flex-col w-72 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 h-full shrink-0 shadow-sm z-20">.*?</aside>',
        """<aside className="hidden md:flex flex-col w-72 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 h-full shrink-0 shadow-sm z-20">
                <SidebarContent user={user} auth={auth} totalUnread={totalUnread} t={t} />
            </aside>""",
        content,
        flags=re.DOTALL
    )

    # Step 2: Replace Mobile Dropdown Menu with Mobile Drawer
    drawer_html = """{/* Mobile Sidebar Overlay */}
                {showingNavigationDropdown && (
                    <div 
                        className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden transition-opacity"
                        onClick={() => setShowingNavigationDropdown(false)}
                    ></div>
                )}

                {/* Mobile Sidebar Drawer */}
                <div 
                    className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${
                        showingNavigationDropdown ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex justify-end p-4 absolute top-0 right-0">
                        <button 
                            onClick={() => setShowingNavigationDropdown(false)}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <i className="fa-solid fa-xmark text-xl"></i>
                        </button>
                    </div>
                    <SidebarContent user={user} auth={auth} totalUnread={totalUnread} t={t} />
                </div>"""
                
    content = re.sub(
        r'\{\/\* Mobile Dropdown Menu \(Hidden on Desktop\) \*\/\}.*?\{\/\* Main scrollable area \*\/\}',
        drawer_html + '\n\n                {/* Main scrollable area */}',
        content,
        flags=re.DOTALL
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Success")

if __name__ == '__main__':
    process()
