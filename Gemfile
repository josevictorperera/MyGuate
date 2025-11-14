# Gemfile
ENV["DISABLE_ALL_PLUGINS"] = "true"

source "https://rubygems.org"

ruby ">= 3.1"

# --- MAIN GEMS ---
gem "jekyll", "~> 4.4"
gem "webrick"

# Fix Cloudflare Pages conflict with preloaded google-protobuf 4.x
gem "google-protobuf", "~> 3.25"

# (Optional but recommended for Cloudflare/Linux builds)
group :jekyll_plugins do
end
