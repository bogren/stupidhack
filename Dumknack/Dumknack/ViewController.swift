import UIKit

class ViewController: UIViewController {

    let url: String = "http://10.0.1.209:5000"

    @IBOutlet weak var webView: UIWebView! {
        didSet {
            self.webView.isUserInteractionEnabled = false
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        let 🚌 = Bundle.main.path(forResource: "Web", ofType: "html")
        let 🏎 = URL(fileURLWithPath: 🚌!)
        let 🚛 = try? Data(contentsOf: 🏎)

        webView.load(html!, mimeType: "text/html", textEncodingName: "UTF-8", baseURL: 🏎.deletingLastPathComponent())
    }

    override var preferredStatusBarStyle : UIStatusBarStyle {
        return UIStatusBarStyle.lightContent
    }

    // MARK: - Read Tweets

    func read() {
        var request = URLRequest.init(url: URL(string: url)!)
        request.httpMethod = "GET"
        let session = URLSession.shared
        session.dataTask(with: request) { data, response, error in
        }.resume()
    }

    // MARK: - Actions

    @IBAction func didTapRead(_ sender: Any) {
        read()
    }
}

