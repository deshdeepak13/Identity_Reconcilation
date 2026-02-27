import React from "react";
import {
  Lightbulb,
  GitMerge,
  Network,
  Database,
  Search,
  UserPlus,
  Loader,
} from "lucide-react";

export default function Explanation() {
  const steps = [
    {
      icon: Network,
      title: "Introduction",
      description: (
        <div className="space-y-4">
          <p>
            Currently, I am using a <strong>Disjoint Set Union (DSU)</strong>{" "}
            based approach for Identity Reconciliation. Below is the reasoning
            behind why I chose this over simpler traversals.
          </p>
        </div>
      ),
    },
    {
      icon: Database,
      title: "1. Visualizing as a Graph",
      description: (
        <div className="space-y-4">
          <p>
            I realised that this is a graph problem where each contact is a node
            and the edges are{" "}
            <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-orange-400">
              phoneNumber
            </code>{" "}
            or{" "}
            <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-orange-400">
              email
            </code>
            . We need to find the whole connected cluster.
          </p>
          <p>A simple 1-level lookup fails in deep transitive cases:</p>
          <div className="bg-zinc-950 p-4 rounded-xl font-mono text-sm border border-zinc-800 text-zinc-300 w-max">
            <div>A (Primary)</div>
            <div className="text-zinc-500 ml-4">↓</div>
            <div>B (Secondary)</div>
            <div className="text-zinc-500 ml-4">↓</div>
            <div>C (Secondary)</div>
            <div className="text-zinc-500 ml-4">↓</div>
            <div>D (Secondary)</div>
          </div>
          <p>
            Querying for{" "}
            <code className="bg-zinc-800 px-1.5 py-0.5 rounded">D</code> might
            only return{" "}
            <code className="bg-zinc-800 px-1.5 py-0.5 rounded">C</code> and
            fail to trace back to{" "}
            <code className="bg-zinc-800 px-1.5 py-0.5 rounded">A</code>. Also,
            if <code className="bg-zinc-800 px-1.5 py-0.5 rounded">A → B</code>{" "}
            and <code className="bg-zinc-800 px-1.5 py-0.5 rounded">C → D</code>{" "}
            existed, and we tried to join{" "}
            <code className="bg-zinc-800 px-1.5 py-0.5 rounded">A</code> and{" "}
            <code className="bg-zinc-800 px-1.5 py-0.5 rounded">C</code>, we
            might lose the connection to{" "}
            <code className="bg-zinc-800 px-1.5 py-0.5 rounded">D</code>.
          </p>
        </div>
      ),
    },
    {
      icon: Search,
      title: "2. Trying BFS / Graph Traversal",
      description: (
        <div className="space-y-4">
          <p>
            To solve deeper links, I briefly considered a BFS-style iterative
            solution. The logic:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-300 ml-2">
            <li>Start with directly matched nodes.</li>
            <li>
              Expand the cluster recursively by finding all rows matching any{" "}
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded">
                linkedId
              </code>{" "}
              or <code className="bg-zinc-800 px-1.5 py-0.5 rounded">id</code>.
            </li>
            <li>Repeat until no new nodes are found.</li>
          </ul>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
              <h4 className="font-semibold text-green-400 mb-2">Advantages</h4>
              <ul className="space-y-1 text-sm text-green-300/80">
                <li>✔ Highly Correct</li>
                <li>✔ Handles infinite transitive linking</li>
                <li>✔ Simple to conceptualize</li>
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
              <h4 className="font-semibold text-red-400 mb-2">
                Inefficiencies
              </h4>
              <ul className="space-y-1 text-sm text-red-300/80">
                <li>✖ Multiple consecutive DB queries</li>
                <li>✖ Recomputes connectivity on every single request</li>
                <li>
                  ✖ Time complexity can be <strong>O(K)</strong> where K is
                  cluster depth.
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Lightbulb,
      title: "3. Moving to DSU (Disjoint Set Union)",
      description: (
        <div className="space-y-3">
          <p>
            I realised that finding the primary node of a cluster is exactly the{" "}
            <strong>Union-Find (DSU)</strong> problem. DSU gives us:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-2">
            <li>
              <strong className="text-orange-400">Efficient merging</strong> of
              disjoint sets (merging two separate identities).
            </li>
            <li>
              <strong className="text-orange-400">Path compression</strong> to
              keep trees completely flat.
            </li>
            <li>
              <strong className="text-orange-400">
                Amortized near-constant time
              </strong>{" "}
              operations globally.
            </li>
          </ul>
        </div>
      ),
    },
    {
      icon: GitMerge,
      title: "4. DSU Implementation Details",
      description: (
        <div className="space-y-4">
          <p>
            Traditional DSU uses in-memory arrays like{" "}
            <code className="bg-zinc-800 px-1.5 py-0.5 rounded">parent[]</code>{" "}
            and{" "}
            <code className="bg-zinc-800 px-1.5 py-0.5 rounded">rank[]</code>.
            But here, the database is our source of truth, so we need
            persistence.
          </p>
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3 text-sm">
            <p>
              <strong>Mapping DSU to DB columns:</strong>
            </p>
            <ul className="list-disc list-inside text-zinc-400 space-y-1">
              <li>
                <code className="text-orange-400">linkedId</code> acts exactly
                as the parent pointer.
              </li>
              <li>
                <strong>Primary Contact</strong> = Root (parent is{" "}
                <code>null</code>).
              </li>
              <li>
                <strong>Secondary Contact</strong> = Child (parent is Primary).
              </li>
            </ul>
            <div className="h-px bg-zinc-800 w-full my-3"></div>
            <p>
              <strong>Union Operation (When clusters connect):</strong>
            </p>
            <ul className="list-decimal list-inside text-zinc-400 space-y-1">
              <li>Find roots of both matched nodes.</li>
              <li>
                Compare <code className="text-orange-400">createdAt</code>: the
                older root remains Primary.
              </li>
              <li>
                Update the newer root's (and its children's){" "}
                <code className="text-orange-400">linkedId</code> to the older
                root (Union by oldest).
              </li>
            </ul>
            <div className="h-px bg-zinc-800 w-full my-3"></div>
            <p className="text-green-400">
              <strong>Path Compression (Crucial):</strong>
            </p>
            <p className="text-zinc-400 leading-relaxed">
              During the <code>findRoot()</code> traversal, we track the entire
              upward path. Once the global root is found, we proactively update
              the <code className="text-orange-400">linkedId</code> of all
              visited intermediate nodes to point directly to the ultimate root.
              This ensures the DB tree collapses to depth 1, eliminating
              long-term nested queries!
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Database,
      title: "5. Final Payload Construction",
      description: (
        <div className="space-y-3">
          <p>
            After the clusters are securely merged and path constraints
            enforced:
          </p>
          <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-2 leading-relaxed">
            <li>
              We simply fetch all rows where{" "}
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded">
                id = root.id
              </code>{" "}
              OR{" "}
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded">
                linkedId = root.id
              </code>
              .
            </li>
            <li>
              Because of path compression, this{" "}
              <strong>single database query</strong> guarantees we will fetch
              the entire cluster! No BFS queries needed.
            </li>
            <li>
              If the user payload introduces unseen emails or phone numbers, we
              insert a new Secondary node directly linked to the root.
            </li>
            <li>
              Finally, we aggregate and format all unique emails, phone numbers,
              and secondary IDs.
            </li>
          </ul>
        </div>
      ),
    },
    {
      icon: GitMerge,
      title: "6. Matchup: DSU vs BFS",
      description: (
        <div className="overflow-x-auto mt-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 text-zinc-300 font-semibold border-b border-zinc-700 w-1/2">
                  BFS (Graph Traversal)
                </th>
                <th className="px-4 py-3 text-orange-400 font-semibold border-b border-orange-500/30 w-1/2">
                  Persisted DSU (My Approach)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-zinc-400">
              <tr>
                <td className="px-4 py-3 border-r border-zinc-800/50">
                  Expands cluster manually on every request via iterative lookup
                </td>
                <td className="px-4 py-3 border-l border-zinc-800/50">
                  Validates root via direct lookup across compressed paths
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 border-r border-zinc-800/50">
                  Multiple recursive DB reads required to flush out deepest node
                </td>
                <td className="px-4 py-3 border-l border-zinc-800/50">
                  Single DB traversal during cluster gathering
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-red-400 border-r border-zinc-800/50">
                  <strong>O(K)</strong> database queries per request
                </td>
                <td className="px-4 py-3 text-green-400 border-l border-zinc-800/50">
                  <strong>Amortized O(1)</strong> database queries
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 border-r border-zinc-800/50">
                  Stateless. Re-does the hard work again next time
                </td>
                <td className="px-4 py-3 border-l border-zinc-800/50">
                  Mutates the DB. Future queries become instantly resolved
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      icon: UserPlus,
      title: "7. Important Additional Optimisations",
      description: (
        <div className="space-y-4">
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <h4 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              Handling Race Conditions
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              In a highly concurrent system, two identical payload requests
              firing at the exact same millisecond could result in duplicating a
              Primary contact. I mitigated this by wrapping the entire
              resolution flow inside a <strong>Database Transaction</strong>{" "}
              combined with row-level locking (
              <code className="bg-zinc-800 px-1 py-0.5 rounded">
                transaction.LOCK.UPDATE
              </code>
              ). This stalls parallel flows trying to touch the same contact
              path.
            </p>
          </div>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <h4 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              Eliminated Sorting Overhead
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Rather than eagerly fetching all nodes, sorting them in memory by
              date, and picking the oldest—the DSU strictly executes "Union by
              Oldest". We simply compare the{" "}
              <code className="bg-zinc-800 px-1 py-0.5 rounded">createdAt</code>{" "}
              timestamps of the roots being merged at the time of merging. The
              ultimate root is inherently guaranteed to be the oldest, bypassing
              heavy array sorting operations!
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Search,
      title: "8. Future Optimizations",
      description: (
        <div className="space-y-3">
          <p>
            To scale this system effortlessly to millions of contacts, the most
            effective next step is applying precise DB Indexing.
          </p>
          <ul className="list-disc list-inside text-zinc-400 text-sm space-y-2 ml-2">
            <li>
              B-Tree index on{" "}
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-orange-400">
                email
              </code>{" "}
              and{" "}
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-orange-400">
                phoneNumber
              </code>{" "}
              for O(log N) fast exact match lookups.
            </li>
            <li>
              Index on{" "}
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded">
                linkedId
              </code>{" "}
              to instantly fetch all children belonging to a root without full
              table scans.
            </li>
          </ul>
        </div>
      ),
    },
    {
      icon: Network,
      title: "9. Time Complexities Evolution",
      description: (
        <div className="overflow-x-auto mt-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-zinc-900/50 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-zinc-300 font-semibold w-1/4">
                  System State
                </th>
                <th className="px-4 py-3 text-zinc-300 font-semibold w-1/4">
                  Lookup Complex.
                </th>
                <th className="px-4 py-3 text-zinc-300 font-semibold">
                  Outcome / Note
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-zinc-400">
              <tr>
                <td className="px-4 py-4 font-medium text-white border-r border-zinc-800/50">
                  Initial{" "}
                  <span className="block text-xs text-zinc-500 font-normal">
                    (1-Level Lookup)
                  </span>
                </td>
                <td className="px-4 py-4 border-r border-zinc-800/50">
                  <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-red-500">
                    Failed Logic
                  </code>
                </td>
                <td className="px-4 py-4 text-xs font-medium">
                  Could not logically handle transitive relations resulting in
                  partial clusters returning.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-white border-r border-zinc-800/50">
                  With BFS{" "}
                  <span className="block text-xs text-zinc-500 font-normal">
                    (Graph Expansion)
                  </span>
                </td>
                <td className="px-4 py-4 border-r border-zinc-800/50">
                  <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-orange-400">
                    O(K * q)
                  </code>
                </td>
                <td className="px-4 py-4 text-xs">
                  K = cluster depth. Requires iterative (q) queries to DB per
                  request leading to a massive network bottleneck.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-white border-r border-zinc-800/50">
                  With Persisted DSU
                </td>
                <td className="px-4 py-4 border-r border-zinc-800/50">
                  <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-green-400">
                    Amortized O(1)
                  </code>
                </td>
                <td className="px-4 py-4 text-xs">
                  Graph collapses to depth of 1 because of path compression.
                  Validations happen extremely fast efficiently merging older
                  roots.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-white border-r border-zinc-800/50">
                  After Indexing
                </td>
                <td className="px-4 py-4 border-r border-zinc-800/50">
                  <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-green-400 font-bold">
                    O(log N)
                  </code>
                </td>
                <td className="px-4 py-4 text-xs text-green-400/80">
                  B-Tree indexing secures scaling by converting global table
                  scans to logarithmic search times.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-4 sm:p-8 lg:p-12 font-sans text-white selection:bg-orange-500/30">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-zinc-900 p-3 rounded-2xl shadow-sm border border-zinc-800 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                My Approach
              </h1>
              <p className="text-zinc-400 font-medium">
                How Identity Reconciliation works under the hood
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-xl w-full flex items-start gap-5 hover:border-orange-500/30 transition-colors"
              >
                <div className="shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <div className="text-zinc-400 leading-relaxed text-base">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
