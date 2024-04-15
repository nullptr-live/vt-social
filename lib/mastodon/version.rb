# frozen_string_literal: true

module Mastodon
  module Version
    module_function

    def major
      4
    end

    def minor
      3
    end

    def patch
      0
    end

    def default_prerelease
      'alpha.5'
    end

    def prerelease
      ENV['MASTODON_VERSION_PRERELEASE'].presence || default_prerelease
    end

    def build_metadata
      ['glitch.th', ENV.fetch('MASTODON_VERSION_METADATA', nil)].compact_blank.join('.')
    end

    def to_a
      [major, minor, patch].compact
    end

    def to_s
      components = [to_a.join('.')]
      components << "-#{prerelease}" if prerelease.present?
      components << "+#{build_metadata}" if build_metadata.present?
      components.join
    end

    def gem_version
      @gem_version ||= Gem::Version.new(to_s.split('+')[0])
    end

    def repository
      @repository ||= ENV.fetch('GIT_REPOSITORY', false) || ENV.fetch('GITHUB_REPOSITORY', false) || 'treehouse/mastodon'
    end

    def source_base_url
      @source_base_url ||=
        begin
          base = ENV['GITHUB_REPOSITORY'] ? 'https://github.com' : 'https://gitea.treehouse.systems'
          ENV.fetch('SOURCE_BASE_URL', "#{base}/#{repository}")
        end
    end

    # specify git tag or commit hash here
    def source_tag
      @source_tag ||=
        begin
          tag = ENV.fetch('SOURCE_TAG', nil)
          return if tag.nil? || tag.empty?
          tag
        end
    end

    def source_url
      @source_url ||=
        begin
          if source_tag && source_base_url =~ /gitea/
            suffix = if !tag[/\H/]
                       "commit/#{source_tag}"
                     else
                       "branch/#{source_tag}"
                     end
            "#{source_base_url}/#{suffix}"
          else
            source_base_url
          end
        end
    end

    def user_agent
      @user_agent ||= "#{HTTP::Request::USER_AGENT} (Mastodon/#{Version}; +http#{Rails.configuration.x.use_https ? 's' : ''}://#{Rails.configuration.x.web_domain}/)"
    end
  end
end
