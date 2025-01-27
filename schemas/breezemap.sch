<?xml version="1.0" encoding="utf-8"?>
<schema xmlns="http://purl.oclc.org/dsdl/schematron"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:hcmc="http://hcmc.uvic.ca/ns"
  queryBinding="xslt2">
  <title>Schematron constraints for the BreezeMap TEI format for representing GeoData</title>
  <ns prefix="sch" uri="http://purl.oclc.org/dsdl/schematron"/>
  <ns prefix="tei" uri="http://www.tei-c.org/ns/1.0"/>
  <ns prefix="xs" uri="http://www.w3.org/2001/XMLSchema"/>
  <ns prefix="hcmc" uri="http://hcmc.uvic.ca/ns"/>
  <ns prefix="xsl" uri="http://www.w3.org/1999/XSL/Transform"/>
  
<!-- Regular expressions for matching GeoJSON coordinate sets. -->
  <!--<xsl:variable name="rePoint">\s*\[\s*\-?[0-9\.]+\s*,\s*[0-9\.]+(\s*-?[0-9\.]+\s*)?\]\s*</xsl:variable>-->
  <xsl:variable name="rePoint">\s*\[\s*\-?[\d\.]+\s*,\s*\-?[\d\.]+(\s*-?[\d\.]+\s*)?\]\s*</xsl:variable>
  <xsl:variable name="reMultiPoint" select="concat('\s*\[', $rePoint, '(\s*,\s*', $rePoint, '\s*)+', '\]')"/>
  <xsl:variable name="reLineString" select="$reMultiPoint"/>
  <xsl:variable name="reLinearRing" select="concat('\s*\[', $rePoint, '(\s*,', $rePoint, ')&#x7b;3,&#x7d;\s*\]\s*')"/>
  <xsl:variable name="rePolygon" select="concat('\[', $reLinearRing, '(\s*,', $reLinearRing, ')*\]')"/>
  <xsl:variable name="reMultiLineString" select="concat('\s*\[', $reLineString, '(,\s*', $reLineString, ')+', '\s*\]\s*')"/>
  <xsl:variable name="reMultiPolygon" select="concat('\s*\[\s*', $rePolygon, '(\s*,\s*', $rePolygon, ')+\s*\]\s*')"/>
  
<!--  Regular expressions for datetime components. -->
  <xsl:variable name="reIsoDateTime">^\d\d\d\d(-\d\d(-\d\d(T\d\d(:\d\d(:\d\d)?)?)?)?)?(/\d\d\d\d(-\d\d(-\d\d(T\d\d(:\d\d(:\d\d)?)?)?)?)?)?$</xsl:variable>
  
  <!--<pattern>
    <rule context="tei:TEI">
      <report test="*" role="info">These are the regexes used for matching geometries: &#x0a;
      </report>
      <report test="*" role="info">
        rePoint: <value-of select="$rePoint"/> &#x0a;
      </report>
      <report test="*" role="info">
        reMultiPoint: <value-of select="$reMultiPoint"/> &#x0a;
      </report>
      <report test="*" role="info">
        reLineString: <value-of select="$reLineString"/> &#x0a;
      </report>
      <report test="*" role="info">
        reLinearRing: <value-of select="$reLinearRing"/> &#x0a;
      </report>
      <report test="*" role="info">
        rePolygon: <value-of select="$rePolygon"/> &#x0a;
      </report>
      <report test="*" role="info">
        reMultiLineString: <value-of select="$reMultiLineString"/> &#x0a;
      </report>
      <report test="*" role="info">
      reMultiPolygon: <value-of select="$reMultiPolygon"/> &#x0a;
    </report>
    </rule>
  </pattern>-->
  
  <pattern>
    <rule context="tei:place/tei:desc[preceding-sibling::tei:desc]">
      <assert test="child::tei:list and count(child::*) = 1">
        The second desc element in a place must have only a 
        list of pointers (links) in it. If you need complex 
        content, use a sequence of p elements in the first 
        desc.
      </assert>
    </rule>
  </pattern>
  
  <!--<pattern>
    <rule context="tei:location[@type='GeometryCollection']">
      <assert test="count(tei:geo[@n]) gt 1 and not(tei:geo[not(@n)])">
        A location element containing a GeometryCollection must have more than
        one child geo element, and all its child geo elements must have an n
        attribute.
      </assert>
    </rule>
  </pattern>-->
  
  <pattern>
    <rule context="tei:location[@type='GeoJSON']/tei:geo[matches(., '\WPoint\W')]">
      <assert test="matches(., concat($rePoint, '\}$'))">
        This set of coordinates does not match the pattern for a GeoJSON Point.
      </assert>
    </rule>
  </pattern>
  
  <pattern>
    <rule context="tei:location[@type='GeoJSON']/tei:geo[matches(., '\WMultiPoint\W')]">
      <assert test="matches(., concat($reMultiPoint, '\}$'))">
        This set of coordinates does not match the pattern for a GeoJSON MultiPoint.
      </assert>
    </rule>
  </pattern>
  
  <pattern>
    <rule context="tei:location[@type='GeoJSON']/tei:geo[matches(., '\WLineString\W')]">
      <assert test="matches(., concat($reLineString, '\}$'))">
        This set of coordinates does not match the pattern for a GeoJSON LineString.
      </assert>
    </rule>
  </pattern>
  <pattern>
    <rule context="tei:location[@type='GeoJSON']/tei:geo[matches(., '\WMultiLineString\W')]">
      <assert test="matches(., concat($reMultiLineString, '\}$'))">
        This set of coordinates does not match the pattern for a GeoJSON MultiLineString.
      </assert>
    </rule>
  </pattern>
  
  <pattern>
    <rule context="tei:location[@type=('GeoJSON')]/tei:geo[matches(., '\WPolygon\W')]">
      <assert test="matches(., concat($rePolygon, '\}$'))">
        This set of coordinates does not match the pattern for a GeoJSON Polygon:
        <value-of select="$rePolygon"/>
      </assert>
    </rule>
  </pattern>
  
  <pattern>
    <rule context="tei:location[@type=('GeoJSON')]/tei:geo[matches(., '\WMultiPolygon\W')]">
      <assert test="matches(., concat($reMultiPolygon, '\}$'))">
        This set of coordinates does not match the pattern for a GeoJSON MultiPolygon:
        <value-of select="$reMultiPolygon"/>
      </assert>
    </rule>
  </pattern>
  
  <pattern>
    <rule context="tei:location[@type='GeoJSON']">
      <assert test="not(@from-iso) or matches(@from-iso, $reIsoDateTime)">
        ISO date/times must take one of these forms:
        1964, 1964-05, 1964-05-22, 1964-05-22T06, 1964-05-22T06:12, 1964-05-22T06:12:22
      </assert>
      <assert test="not(@to-iso) or matches(@to-iso, $reIsoDateTime)">
        ISO date/times must take one of these forms:
        1964, 1964-05, 1964-05-22, 1964-05-22T06, 1964-05-22T06:12, 1964-05-22T06:12:22
      </assert>
    </rule>
  </pattern>
  
  <pattern>
    <rule context="tei:place">
      <let name="catIds" value="for $c in tokenize(@corresp, '(^|\s+)#') return if (string-length(normalize-space($c)) gt 0) then normalize-space($c) else ()"/>
      <let name="catsExist" value="for $c in $catIds return if (ancestor::tei:TEI/descendant::tei:category[@xml:id = $c] or ancestor::tei:TEI/descendant::tei:classDecl[@xml:id = $c]) then true() else false()"/>
      <assert test="not(false() = $catsExist)">
        Each value in @corresp must point to the @xml:id attribute of a category element in the teiHeader. The following values do not:
        <xsl:value-of select="string-join((for $c in $catIds return if (not(ancestor::tei:TEI/descendant::tei:category[@xml:id = $c])) then concat('#', $c) else()), ', ')"/>
      </assert>
    </rule>
  </pattern>
  
</schema>