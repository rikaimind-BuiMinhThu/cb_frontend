#!/usr/bin/env python3
"""Apply v2 module path/import transforms after copying bot-v2 source files."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src" / "v2"

SKIP_ADMIN_PATH_IN = (
    "assets/css/admin/",
    "assets/css/v2/admin/",
)

def transform_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text

    text = re.sub(r"from ['\"](\.\./)+api/", "from 'api/", text)
    text = text.replace("from 'api/tokenExpired'", "from 'v2/api/tokenExpired'")
    text = text.replace('from "api/tokenExpired"', 'from "v2/api/tokenExpired"')
    text = text.replace("from 'variables/constants'", "from 'v2/variables/constants'")
    text = text.replace('from "variables/constants"', 'from "v2/variables/constants"')

    if "admin-shell.css" not in text:
        def replace_admin_paths(match):
            snippet = match.group(0)
            for skip in SKIP_ADMIN_PATH_IN:
                if skip in snippet:
                    return snippet
            return snippet.replace("/admin/", "/v2/admin/")

        text = re.sub(r"['\"`/][^'\"`\n]*/admin/[^'\"`\n]*['\"`]", replace_admin_paths, text)
        text = text.replace("'/admin'", "'/v2/admin'")
        text = text.replace('"/admin"', '"/v2/admin"')

    if path.name == "AdminLayout.jsx":
        text = text.replace(
            "import '../../assets/css/v2/admin/admin-shell.css';",
            "import 'v2/assets/css/admin/admin-shell.css';",
        )
        text = text.replace(
            "import '../../assets/css/admin/admin-shell.css';",
            "import 'v2/assets/css/admin/admin-shell.css';",
        )

    if path.name == "Login.js" and "components/Admin" in str(path):
        text = text.replace("../../assets/css/login.css", "assets/css/login.css")
        text = text.replace("../../assets/scss/paper-dashboard.scss?v=1.3.0", "assets/scss/paper-dashboard.scss?v=1.3.0")
        text = text.replace("../../assets/demo/demo.css", "assets/demo/demo.css")
        text = text.replace("../../../assets/img/logoEC.jpg", "assets/img/logoEC.jpg")

    if path.name == "LoginFacebook.js":
        text = text.replace("./../../assets/css/loginFacebook.css", "assets/css/loginFacebook.css")
        text = text.replace("'./../../assets/css/loginFacebook.css'", "'assets/css/loginFacebook.css'")
        text = text.replace("from '../../api/api-management'", "from 'api/api-management'")
        text = text.replace("from '../../variables/constants'", "from 'variables/constants'")

    if path.name == "scenarioPreviewBridge.js":
        text = re.sub(
            r"return `/preview-scenario-editor\?",
            "return `/v2/preview-scenario-editor?",
            text,
        )

    if path.name == "InstallationTag.jsx":
        text = text.replace("/sdk-v2.js", "/v2/sdk.js")
        if "/v2/sdk-faq.js" not in text and "faqScript" in text:
            text = text.replace("/v2/sdk.js", "/v2/sdk-faq.js", 1)

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main():
    changed = 0
    for path in ROOT.rglob("*"):
        if path.suffix not in {".js", ".jsx"}:
            continue
        if transform_file(path):
            changed += 1
    print(f"Updated {changed} files under {ROOT}")


if __name__ == "__main__":
    main()
