export type SolidGeometryReconciliationDisposition =
  | "volume-family-proposal"
  | "surface-area-family-proposal"
  | "explicit-expansion-required";

export type SolidGeometryReconciliationEntry = {
  readonly title: string;
  readonly disposition: SolidGeometryReconciliationDisposition;
  readonly proposedCatalogId: 274 | 275 | null;
  readonly governanceDecisionCatalogId: 274 | 275 | 278;
  readonly governanceDecisionStatus: "proposed";
  readonly certificationAuthority: false;
};

// Governance evidence for issue #235. Catalog IDs 274/275 are generic Surface Area / Volume rows.
// The Master Catalog does not state that they are parent rows for these calculators, so these
// relationships are proposals only and MUST NOT be treated as certification or publication authority.
// governanceDecisionCatalogId records the single approval target proposed by issue #235 analysis;
// governanceDecisionStatus remains proposed until the source of truth explicitly approves it.
export const solidGeometryReconciliationManifest = [
  {
    "title": "Torus Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Conical Frustum Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Ellipsoid Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Spherical Cap Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Spherical Sector Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Capsule Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Hemisphere Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Spherical Segment Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Square Pyramid Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Tetrahedron Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Octahedron Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Triangular Prism Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Dodecahedron Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Icosahedron Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Hollow Cylinder Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Oblique Cylinder Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Square Pyramid Frustum Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Spherical Shell Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Rectangular Pyramid Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Triangular Pyramid Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Pentagonal Prism Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Hexagonal Prism Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Square Prism Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Heptagonal Prism Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Octagonal Prism Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Polygonal Prism Volume Calculator",
    "disposition": "volume-family-proposal",
    "proposedCatalogId": 275,
    "governanceDecisionCatalogId": 275,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Torus Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Conical Frustum Lateral Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Spherical Cap Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Cuboid Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Capsule Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Ellipsoid Surface Area Approximation Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Square Pyramid Lateral Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Tetrahedron Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Octahedron Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Triangular Prism Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Hollow Cylinder Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Square Pyramid Frustum Lateral Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Spherical Shell Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Rectangular Pyramid Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Dodecahedron Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Icosahedron Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Triangular Pyramid Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Pentagonal Prism Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Hexagonal Prism Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Square Prism Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Heptagonal Prism Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Regular Octagonal Prism Surface Area Calculator",
    "disposition": "surface-area-family-proposal",
    "proposedCatalogId": 274,
    "governanceDecisionCatalogId": 274,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Cuboid Space Diagonal Calculator",
    "disposition": "explicit-expansion-required",
    "proposedCatalogId": null,
    "governanceDecisionCatalogId": 278,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  },
  {
    "title": "Square Prism Space Diagonal Calculator",
    "disposition": "explicit-expansion-required",
    "proposedCatalogId": null,
    "governanceDecisionCatalogId": 278,
    "governanceDecisionStatus": "proposed",
    "certificationAuthority": false
  }
] as const satisfies readonly SolidGeometryReconciliationEntry[];
