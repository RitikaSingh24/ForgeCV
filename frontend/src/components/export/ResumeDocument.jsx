import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1C1917",
    lineHeight: 1.4,
  },
  header: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#B8431A",
    paddingBottom: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#1C1917",
    marginBottom: 2,
  },
  title: {
    fontSize: 11,
    fontFamily: "Helvetica-Oblique",
    color: "#78716C",
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    fontSize: 9,
    color: "#78716C",
  },
  contactItem: {
    marginRight: 6,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#B8431A",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 3,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 9.5,
    color: "#1C1917",
    marginBottom: 4,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1C1917",
  },
  itemSub: {
    fontSize: 9,
    fontFamily: "Helvetica-Oblique",
    color: "#78716C",
  },
  bulletList: {
    marginTop: 2,
    marginBottom: 6,
    paddingLeft: 4,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
    color: "#B8431A",
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: "#1C1917",
  },
  skillsText: {
    fontSize: 9,
    color: "#1C1917",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#78716C",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
    paddingTop: 6,
  },
});

export function ResumeDocument({ parsedSections = {}, title = "Resume" }) {
  const basics = parsedSections.basics || {};
  const summary = parsedSections.summary || "";
  const experience = parsedSections.experience || [];
  const projects = parsedSections.projects || [];
  const education = parsedSections.education || [];
  const skills = parsedSections.skills || [];
  const certifications = parsedSections.certifications || [];
  const languages = parsedSections.languages || [];

  return (
    <Document title={title} author={basics.name || "ForgeCV User"}>
      <Page size="A4" style={styles.page}>
        {/* Header: Name & Contact */}
        <View style={styles.header}>
          <Text style={styles.name}>{basics.name || "Candidate Name"}</Text>
          {basics.title && <Text style={styles.title}>{basics.title}</Text>}
          <View style={styles.contactRow}>
            {basics.email && <Text style={styles.contactItem}>{basics.email}</Text>}
            {basics.phone && <Text style={styles.contactItem}>•  {basics.phone}</Text>}
            {basics.location && <Text style={styles.contactItem}>•  {basics.location}</Text>}
            {(basics.links || []).map((link, idx) => (
              <Text key={idx} style={styles.contactItem}>•  {link}</Text>
            ))}
          </View>
        </View>

        {/* Summary */}
        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{summary}</Text>
          </View>
        ) : null}

        {/* Work Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {experience.map((exp, idx) => (
              <View key={idx} style={{ marginBottom: 6 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>
                    {exp.role || "Role"} {exp.company ? `| ${exp.company}` : ""}
                  </Text>
                  <Text style={styles.itemSub}>
                    {exp.start || ""} {exp.end ? `- ${exp.end}` : ""}
                  </Text>
                </View>
                <View style={styles.bulletList}>
                  {(exp.bullets || []).map((bullet, bIdx) => (
                    <View key={bIdx} style={styles.bulletItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {projects.map((proj, idx) => (
              <View key={idx} style={{ marginBottom: 6 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{proj.name || "Project"}</Text>
                  {(proj.tech || []).length > 0 && (
                    <Text style={styles.itemSub}>Tech: {proj.tech.join(", ")}</Text>
                  )}
                </View>
                <View style={styles.bulletList}>
                  {(proj.bullets || []).map((bullet, bIdx) => (
                    <View key={bIdx} style={styles.bulletItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills & Competencies</Text>
            <Text style={styles.skillsText}>{skills.join("  •  ")}</Text>
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, idx) => (
              <View key={idx} style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  {edu.degree || "Degree"} {edu.school ? `- ${edu.school}` : ""}
                </Text>
                <Text style={styles.itemSub}>
                  {edu.start || ""} {edu.end ? `- ${edu.end}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications & Languages */}
        {(certifications.length > 0 || languages.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            {certifications.length > 0 && (
              <Text style={styles.text}>Certifications: {certifications.join(", ")}</Text>
            )}
            {languages.length > 0 && (
              <Text style={styles.text}>Languages: {languages.join(", ")}</Text>
            )}
          </View>
        )}

        {/* Page Footer */}
        <View
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) => (
            <>
              <Text>{basics.name || "ForgeCV Resume"}</Text>
              <Text>Page {pageNumber} of {totalPages}</Text>
            </>
          )}
        />
      </Page>
    </Document>
  );
}

export default ResumeDocument;
