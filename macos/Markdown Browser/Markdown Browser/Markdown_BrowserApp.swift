//
//  Markdown_BrowserApp.swift
//  Markdown Browser
//
//  Created by Bruna on 29/10/2025.
//

import SwiftUI
import AppKit

@main
struct Markdown_BrowserApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onAppear {
                    if let window = NSApplication.shared.windows.first {
                        // Maximize the window to fill the screen
                        if let screen = NSScreen.main {
                            window.setFrame(screen.visibleFrame, display: true)
                        }
                    }
                }
        }
    }
}
