<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
		<title>
			<xsl:value-of select="/rss/channel/title"/>
			Web Feed
		</title>
        <link rel="stylesheet" href="/rss/styles.css"/>
      </head>
      <body class="bg-white">
        <nav class="container-md px-3 py-2 mt-2 mt-md-5 mb-5 markdown-body">
          <p class="bg-yellow-light p-1 -ml-1 mb-1">
            <strong>This is a web feed,</strong> also known as an RSS feed. <strong>Subscribe</strong> by copying the URL from the address bar into your newsreader.
          </p>
          <p class="text-gray">
            Visit <a href="https://aboutfeeds.com">About Feeds</a> to get started with newsreaders and subscribing. It’s free.
          </p>
        </nav>
        <div class="container-md p-3 markdown-body">
          <header class="py-5">
            <h1 class="border-0">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="vertical-align: text-bottom; width: 1.2em; height: 1.2em;" class="pr-1" id="RSSicon" viewBox="0 0 256 256">
                <defs>
                  <linearGradient x1="0.085" y1="0.085" x2="0.915" y2="0.915" id="RSSg">
                    <stop  offset="0.0" stop-color="#E3702D"/><stop  offset="0.1071" stop-color="#EA7D31"/>
                    <stop  offset="0.3503" stop-color="#F69537"/><stop  offset="0.5" stop-color="#FB9E3A"/>
                    <stop  offset="0.7016" stop-color="#EA7C31"/><stop  offset="0.8866" stop-color="#DE642B"/>
                    <stop  offset="1.0" stop-color="#D95B29"/>
                  </linearGradient>
                </defs>
                <rect width="256" height="256" rx="55" ry="55" x="0"  y="0"  fill="#CC5D15"/>
                <rect width="246" height="246" rx="50" ry="50" x="5"  y="5"  fill="#F49C52"/>
                <rect width="236" height="236" rx="47" ry="47" x="10" y="10" fill="url(#RSSg)"/>
                <circle cx="68" cy="189" r="24" fill="#FFF"/>
                <path d="M160 213h-34a82 82 0 0 0 -82 -82v-34a116 116 0 0 1 116 116z" fill="#FFF"/>
                <path d="M184 213A140 140 0 0 0 44 73 V 38a175 175 0 0 1 175 175z" fill="#FFF"/>
              </svg>
              Web Feed Preview
            </h1>
            <h2>
              <xsl:value-of select="/rss/channel/title"/>
            </h2>
            <p>
              <xsl:value-of select="/rss/channel/description"/>
            </p>
            <a>
              <xsl:attribute name="href">
                <xsl:value-of select="/rss/channel/link"/>
              </xsl:attribute>
              Visit Website &#x2192;
            </a>
          </header>
          <h2>Recent Items</h2>
          <ul class="list-style-none pl-0">
            <xsl:for-each select="/rss/channel/item">
              <li class="mb-5">
                <article>
                  <h3 class="mb-0">
                    <a>
                      <xsl:attribute name="href">
                        <xsl:value-of select="link"/>
                      </xsl:attribute>
                      <xsl:value-of select="title"/>
                    </a>
                  </h3>
                  <p class="mb-1 text-small">
                    Published:
                    <time datetime="{pubDate}">
                      <!-- Extract the first 16 characters of pubDate which gives us "Day, DD MMM YYYY" format -->
                      <xsl:value-of select="substring(pubDate, 1, 16)" />
                    </time>
                  </p>
                  <xsl:if test="category">
                    <p class="mb-1 text-gray">
                      Categories:
                      <xsl:for-each select="category">
                        <xsl:value-of select="."/>
                        <xsl:if test="position() != last()">, </xsl:if>
                      </xsl:for-each>
                    </p>
                  </xsl:if>
                  <p>
                    <xsl:value-of select="description"/>
                  </p>
                </article>
              </li>
            </xsl:for-each>
          </ul>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
