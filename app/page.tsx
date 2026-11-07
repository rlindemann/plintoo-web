import Navbar from "@/components/Navbar";
import Dial from "@/components/Dial";
import Effects from "@/components/Effects";

const SITES: [string, number][] = [
  ["1300,540 1420,520 1440,640 1310,660", 0.4],
  ["1250,760 1330,750 1340,830 1255,840", 0.62],
  ["1880,650 1990,640 2000,730 1890,740", 0.84],
  ["1390,960 1460,955 1470,1020 1395,1030", 1.06],
  ["1620,430 1700,425 1705,500 1625,505", 1.28],
  ["2100,1180 2190,1170 2200,1250 2110,1258", 1.5],
];

function Kick({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="kick rv">
      <b>{n}</b>
      {children}
    </div>
  );
}

function Pilot() {
  return (
    <div className="tag">
      <i />
      In the pilot
    </div>
  );
}

const FAQ: [string, string][] = [
  [
    "What is Plintoo?",
    "The harness for architects and property developers: the software around the AI model. It gives a practice its own data and memory, its own tested workflows and its own model, and lets it plug in any AI.",
  ],
  ["Which AI models can we use?", "Any. Plintoo is model-agnostic. Change the model and the practice keeps its data, its memory and its methods."],
  [
    "Who owns our data?",
    "Your practice does. Its files, its memory and its decisions belong to the practice, not to Plintoo and not to the AI provider.",
  ],
  ["What happens if Plintoo stops?", "[TO CONFIRM: the export and self-hosting promise, once it works end to end.]"],
  [
    "Is it ready?",
    'Plintoo is in its pilot with a first small group of practices. Everything marked "In the pilot" on this page is being tested on real work with them.',
  ],
];

export default function Home() {
  return (
    <>
      <Navbar />
      <Effects />
      <main id="top">
        {/* Hero: London map from the sign-in prototype, direction A */}
        <section className="hero" aria-label="Plintoo">
          <div className="stage" id="stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/london.png" alt="" />
            <svg viewBox="0 0 2560 1600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <circle className="ring" cx="1370" cy="590" r="240" />
              {SITES.map(([pts, d], i) => (
                <polygon key={pts} className={`site${i === 0 ? " sel" : ""}`} style={{ animationDelay: `${d}s` }} points={pts} />
              ))}
              <text className="lbl" x="1460" y="530" style={{ animationDelay: ".6s" }}>
                SITE 01 · 0.62 ha
              </text>
              <text className="lbl" x="1460" y="562" style={{ animationDelay: ".8s", fontSize: 20, fill: "#A6AFBA" }}>
                constraints · applications · appeals
              </text>
            </svg>
            <div className="scan" />
          </div>
          <div className="illus">Illustration</div>
          <div className="copy">
            <h1>
              The command centre
              <br />
              for architects and
              <br />
              <span>property developers.</span>
            </h1>
            <p className="sub">Your practice owns its data, its memory and its own model, and plugs in whichever AI is best this month.</p>
            <div className="row">
              <a className="go" href="#join">
                <span>Join the pilot</span>
                <span aria-hidden="true">→</span>
              </a>
              <a className="alt" href="#film">
                Watch the film
              </a>
            </div>
          </div>
          <div className="tick" aria-label="Data in Plintoo">
            <div>
              <div className="v mono" data-to="200000">0</div>
              <div className="l">planning applications</div>
            </div>
            <div>
              <div className="v mono" data-to="180000">0</div>
              <div className="l">appeal decisions</div>
            </div>
          </div>
        </section>

        {/* 01 Problem */}
        <section className="problem">
          <div className="wrap">
            <Kick n="01">The problem</Kick>
            <div className="pair">
              <div className="rv">
                <h2>
                  Too many tools.
                  <br />
                  Nothing connects.
                </h2>
                <p>Every quarter a new subscription. None of them knows the practice, the site or the policy.</p>
              </div>
              <div className="rv">
                <h2>
                  Nobody
                  <br />
                  <span style={{ color: "var(--nblue)" }}>keeps why.</span>
                </h2>
                <p>Tools change, models change, people leave. The reasons behind the decisions go with them.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 02 The film, v11 */}
        <section className="film" id="film">
          <div className="wrap">
            <Kick n="02">The film</Kick>
            <div className="grid">
              <div className="rv">
                <h2 className="big" style={{ fontSize: "clamp(44px,6vw,96px)" }}>
                  One command centre.
                  <br />
                  <span>Any AI model.</span>
                </h2>
                <div className="lines">
                  The right one for each job.
                  <br />
                  <b>Your data. Your memory. Your model.</b>
                  <br />
                  Owned by the practice, not rented.
                </div>
              </div>
              <div className="rv">
                <div className="frame">
                  <video id="filmv" muted loop playsInline preload="metadata" controls>
                    <source src="/manifesto-v11.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="meta">
                  <span>PLINTOO · MANIFESTO</span>
                  <span>01:45</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 Rented memory */}
        <section className="enemy">
          <div className="wrap">
            <Kick n="03">Rented memory</Kick>
            <div className="grid">
              <h2 className="big rv">
                You don&apos;t own your practice&apos;s memory. <span>You rent it.</span>
              </h2>
              <p className="note rv">
                The model, the tools and what the practice knows all sit in someone else&apos;s software. <b>Stop paying, and it is gone.</b>
              </p>
            </div>
          </div>
        </section>

        {/* 04 The plausible lie */}
        <section className="enemy">
          <div className="wrap">
            <Kick n="04">The plausible lie</Kick>
            <div className="grid">
              <h2 className="big rv">
                Your AI is lying to you. <span className="strike">Politely.</span>
              </h2>
              <p className="note rv">
                AI text sounds right, has no source, and gets signed anyway. An architect is liable for decades.{" "}
                <b>In Plintoo every answer comes back with its source, and nothing is kept until a person accepts it.</b>
              </p>
            </div>
          </div>
        </section>

        {/* 05 Shifts */}
        <section className="shifts enemy">
          <div className="wrap">
            <Kick n="05">What is changing</Kick>
            <h2 className="big rv">
              The model was never the problem.
              <br />
              <span>Everything around it is.</span>
            </h2>
            <div className="cols">
              <div className="rv">
                <div className="n">SHIFT 01 · THE MODEL</div>
                <h3>Most of the work doesn&apos;t need the most powerful model.</h3>
                <p>A sledgehammer to crack a nut, every day, at the top price.</p>
              </div>
              <div className="rv">
                <div className="n">SHIFT 02 · THE TOOLS</div>
                <h3>The AI and the tools around it are the same for every practice.</h3>
                <p>None of it knows the planning policy, the site or how your practice works.</p>
              </div>
              <div className="rv">
                <div className="n">SHIFT 03 · WHAT YOU OWN</div>
                <h3>The value moves to what the practice owns.</h3>
                <p>Its own data, its own memory, its own methods.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 06 Dial */}
        <section className="dialsec" id="workspaces">
          <div className="wrap">
            <Kick n="06">Everything in one place</Kick>
            <div className="grid">
              <div className="rv">
                <h2 className="big" style={{ fontSize: "clamp(44px,5.4vw,80px)" }}>
                  One place to run them all.
                </h2>
                <div className="lines">
                  Any model · <b>One memory</b>
                  <br />
                  Any team · <b>One record</b>
                  <br />
                  <b>Keep</b> every reason.
                </div>
                <p className="lede" style={{ fontSize: 16 }}>
                  Plintoo is the harness for architecture: the software around the AI model. The tools it runs, the data it reads, the
                  methods it follows and the checks it can&apos;t skip.
                </p>
                <Pilot />
              </div>
              <Dial />
            </div>
          </div>
        </section>

        {/* 07 Three blocks */}
        <section className="blocks" id="workflows">
          <div className="wrap">
            <Kick n="07">How it works</Kick>
            {[
              {
                h: ["Run every tool", "from one place."],
                li: [
                  ["Documents", "written and edited with the AI, with sources"],
                  ["Maps", "sites, constraints and planning layers"],
                  ["3D", "Rhino, shown in the Plintoo viewer"],
                  ["Assets", "the practice's images and files"],
                ],
                screen: "Screen recording: one chat driving documents, map and Rhino",
              },
              {
                h: ["The practice's", "own memory."],
                li: [
                  ["Answers with sources", "you can see where every answer came from"],
                  ["Decisions", "what was decided, why, the evidence and who owned it"],
                  ["Shared", "the whole team works from the same memory"],
                ],
                screen: "Screen recording: an answer with its sources, and a decision record",
              },
              {
                h: ["Its own workflows", "and model."],
                li: [
                  ["Site appraisal", "a full site report, from the address"],
                  ["Planning", "policy, precedent and past applications"],
                  ["Development appraisal", "the numbers behind a scheme"],
                  ["Own model", "trained on architecture, partly trained already"],
                ],
                screen: "Screen recording: a site appraisal report being built",
              },
            ].map((b) => (
              <div className="block" key={b.h[0]}>
                <div className="rv">
                  <h3>
                    {b.h[0]}
                    <br />
                    {b.h[1]}
                  </h3>
                  <ul>
                    {b.li.map(([k, v]) => (
                      <li key={k}>
                        <b>{k}</b>
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                  <Pilot />
                </div>
                <div className="screen rv">{b.screen}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 08 95% */}
        <section className="enemy">
          <div className="wrap">
            <Kick n="08">How Plintoo does the work</Kick>
            <div className="dim95 rv" id="dim95">
              <div className="fig">
                <span className="v" id="pct">
                  0
                </span>
                <span className="u">
                  % of the work
                  <br />
                  doesn&apos;t need the most powerful model
                </span>
              </div>
              <div className="dline" aria-label="95 percent on the practice's own setup, 5 percent on the top model">
                <div className="axis" />
                <div className="end" style={{ left: 0 }} />
                <div className="end" style={{ right: 0 }} />
                <div className="end" style={{ left: "95%" }} />
                <div className="band" />
                <div className="top" />
                <div className="t" style={{ left: 0 }}>
                  95% · your data, your workflows, your model
                </div>
                <div className="t" style={{ right: 0, textAlign: "right" }}>
                  5% · top model
                </div>
              </div>
            </div>
            <p className="lede rv">
              The top model costs up to about a hundred times a small one. With its own data and memory, its own tested workflows and its
              own model, a practice runs the 95% for less, and keeps the top model for the hard 5%.
            </p>
            <p className="foot">95 / 5 is the founder&apos;s estimate from twenty years of practice. Price difference from published AI model list prices.</p>
          </div>
        </section>

        {/* 09 Data */}
        <section className="enemy" id="data">
          <div className="wrap">
            <Kick n="09">Data</Kick>
            <h2 className="big rv">
              Connected to the whole record.
              <br />
              <span>More valuable with every project.</span>
            </h2>
            <div className="figs">
              <div className="rv">
                <div className="v" data-to="200000">
                  0
                </div>
                <div className="l">planning applications, with drawings and documents</div>
              </div>
              <div className="rv">
                <div className="v" data-to="180000">
                  0
                </div>
                <div className="l">appeal decisions</div>
              </div>
              <div className="rv">
                <div className="v">London</div>
                <div className="l">connected to the Planning London Datahub</div>
              </div>
              <div className="rv">
                <div className="v">Yours</div>
                <div className="l">the practice&apos;s own projects, methods and decisions</div>
              </div>
            </div>
            <Pilot />
          </div>
        </section>

        {/* 10 Who it's for */}
        <section className="enemy">
          <div className="wrap">
            <Kick n="10">Who it&apos;s for</Kick>
            <h2 className="big rv">
              Built for the people
              <br />
              who run the work.
            </h2>
            <div className="people">
              {[
                ["DAILY", "Architect", "One chat every day. Answers with sources. Accepts the work before it is kept."],
                ["PER JOB", "Project lead", "Decision records, fee and scope alerts, specification drafts."],
                ["PER BID", "Partner", "Pricing from past jobs. Extra fee claims with the evidence behind them."],
                ["ONCE", "Practice admin", "Sets up models, allowances and workflows for the whole office."],
              ].map(([n, h, p]) => (
                <div className="rv" key={h}>
                  <div className="n">{n}</div>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11 Founder */}
        <section className="founder enemy">
          <div className="wrap">
            <Kick n="11">Who is building it</Kick>
            <blockquote className="rv">
              &ldquo;I&apos;ve been an architect for twenty years, running projects and the technology behind them. Today I have the most
              powerful AI models on my desk, and I still can&apos;t use them properly on real work.{" "}
              <span>The model was never the problem. Everything around it is.</span>&rdquo;
            </blockquote>
            <div className="who rv">
              <span>RALF LINDEMANN · FOUNDER</span>
              <span>ONE BLACKFRIARS</span>
              <span>ASPEN</span>
              <span>THE LINE</span>
            </div>
          </div>
        </section>

        {/* 12 Trust */}
        <section className="enemy" id="trust">
          <div className="wrap">
            <Kick n="12">Trust</Kick>
            <h2 className="big rv">Questions.</h2>
            <div className="faq">
              {FAQ.map(([q, a], i) => (
                <details key={q}>
                  <summary>
                    <span className="k">Q.{String(i + 1).padStart(2, "0")}</span>
                    {q}
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Join */}
        <section className="join" id="join">
          <div className="wrap">
            <h2 className="rv">
              Change every tool.
              <br />
              Keep every reason.
            </h2>
            <p className="rv">We are setting up the first practices by hand. Leave your email and we will be in touch.</p>
            <form action="[FORM_ENDPOINT]" method="post" className="rv">
              <input type="email" name="email" placeholder="name@practice.co.uk" required autoComplete="email" aria-label="Work email" />
              <button type="submit">
                <span>Join the pilot</span>
                <span aria-hidden="true">→</span>
              </button>
            </form>
          </div>
        </section>
        <div className="legal">
          <span>PLINTOO</span>
          <span>plintoo.app</span>
        </div>
      </main>
    </>
  );
}
