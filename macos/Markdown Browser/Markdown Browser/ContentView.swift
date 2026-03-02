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
        // Intercept and forward common keyboard shortcuts to the WebView
        if event.modifierFlags.contains(.command) {
            let key = event.charactersIgnoringModifiers?.lowercased() ?? ""
            
            switch key {
            case "t": // Command+T (New Tab)
                forwardKeyboardEvent(key: "t", metaKey: true)
                return true
            case "w": // Command+W (Close Window/Tab)
                forwardKeyboardEvent(key: "w", metaKey: true)
                return true
            case "r": // Command+R (Refresh)
                forwardKeyboardEvent(key: "r", metaKey: true)
                return true
            case "l": // Command+L (Location bar)
                forwardKeyboardEvent(key: "l", metaKey: true)
                return true
            case "n": // Command+N (New Window)
                forwardKeyboardEvent(key: "n", metaKey: true)
                return true
            case "f": // Command+F (Search)
                forwardKeyboardEvent(key: "f", metaKey: true)
                return true
            case ",": // Command+, (Preferences)
                forwardKeyboardEvent(key: ",", metaKey: true)
                return true
            default:
                break
            }
        }
        
        // Call super for other key combinations
        return super.performKeyEquivalent(with: event)
    }
    
    private func forwardKeyboardEvent(key: String, metaKey: Bool = false, ctrlKey: Bool = false, altKey: Bool = false, shiftKey: Bool = false) {
        // Create a JavaScript keyboard event and dispatch it
        let jsCode = """
            (function() {
                var event = new KeyboardEvent('keydown', {
                    key: '\(key)',
                    code: 'Key\(key.uppercased())',
                    keyCode: \(keyCodeForCharacter(key)),
                    which: \(keyCodeForCharacter(key)),
                    metaKey: \(metaKey),
                    ctrlKey: \(ctrlKey),
                    altKey: \(altKey),
                    shiftKey: \(shiftKey),
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(event);
                
                // Also dispatch keyup event
                var keyupEvent = new KeyboardEvent('keyup', {
                    key: '\(key)',
                    code: 'Key\(key.uppercased())',
                    keyCode: \(keyCodeForCharacter(key)),
                    which: \(keyCodeForCharacter(key)),
                    metaKey: \(metaKey),
                    ctrlKey: \(ctrlKey),
                    altKey: \(altKey),
                    shiftKey: \(shiftKey),
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(keyupEvent);
            })();
        """
        
        evaluateJavaScript(jsCode, completionHandler: nil)
    }
    
    private func keyCodeForCharacter(_ char: String) -> Int {
        switch char.lowercased() {
        case "t": return 84
        case "w": return 87
        case "r": return 82
        case "l": return 76
        case "n": return 78
        case "f": return 70
        case ",": return 188
        default: return char.uppercased().unicodeScalars.first?.value.hashValue ?? 0
        }
    }
}

struct WebView: NSViewRepresentable {
    let url: URL

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeNSView(context: Context) -> WKWebView {
        let webView = CustomWKWebView()
        webView.uiDelegate = context.coordinator
        return webView
    }

    func updateNSView(_ webView: WKWebView, context: Context) {
        if webView.url != url {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }

    class Coordinator: NSObject, WKUIDelegate {
        func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
            if let url = navigationAction.request.url {
                NSWorkspace.shared.open(url)
            }
            return nil
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

