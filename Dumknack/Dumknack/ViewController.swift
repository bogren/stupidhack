import UIKit

class ViewController: UIViewController {

    let url: String = "http://10.0.1.209:5000"

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    // MARK: - Read Tweets

    func read() {
        var request = URLRequest.init(url: URL(string: url)!)
        request.httpMethod = "GET"
        let session = URLSession.shared
        session.dataTask(with: request) { data, response, error in
            print(error)
        }.resume()
    }

    // MARK: - Actions

    @IBAction func didTapRead(_ sender: Any) {
        read()
    }
}

