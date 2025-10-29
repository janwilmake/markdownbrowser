//
//  ContentView.swift
//  Markdown Browser
//
//  Created by Bruna on 29/10/2025.
//

import SwiftUI
import WebKit

class CustomWKWebView: WKWebView {
    override func performKeyEquivalent(with event: NSEvent) -> Bool {
        // Disable common keyboard shortcuts
        if event.modifierFlags.contains(.command) {
            switch event.charactersIgnoringModifiers {
            case "t", "T": // Command+T (New Tab)
                return true
            case "w", "W": // Command+W (Close Window/Tab)
                return true
            case "r", "R": // Command+R (Refresh)
                return true
            case "l", "L": // Command+L (Location bar)
                return true
            case "n", "N": // Command+N (New Window)
                return true
            case "m", "M": // Command+M (Minimize)
                return true
            case "h", "H": // Command+H (Hide)
                return true
            case "f", "F": // Command+F (Search)
                return true
            case ",": // Command+, (Preferences)
                return true
            default:
                break
            }
        }
        
        // Call super for other key combinations
        return super.performKeyEquivalent(with: event)
    }
}

struct WebView: NSViewRepresentable {
    let url: URL
    
    func makeNSView(context: Context) -> WKWebView {
        return CustomWKWebView()
    }
    
    func updateNSView(_ webView: WKWebView, context: Context) {
        if webView.url != url {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }
}

struct ContentView: View {
    var body: some View {
        if let url = URL(string: "https://markdownbrowser.com/?client=macos") {
            WebView(url: url)
                .navigationTitle("")
        } else {
            Text("Invalid URL")
                .navigationTitle("Error")
        }
    }
}

#Preview {
    ContentView()
}

