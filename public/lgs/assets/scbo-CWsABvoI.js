const e="scbo",t="SCBO: what happens to an ad, stage by stage",s="Portal pedia · 45",a="SCBO: what happens to an ad, from the state newspaper to the board",n="South Carolina makes every agency, college, county and city advertise in one place. We read that newspaper every day. This page walks the run of 28 July 2026 stage by stage, with a real record pulled off disk at each step. Two ads are followed the whole way: one that was already dead before the night started, and one that ends as a YES at score 92.",o=[{value:"449",label:"in snapshot"},{value:"380",label:"carryover"},{value:"69",label:"new tonight"},{value:"32",label:"open (live set)"},{value:"7",label:"yes"},{value:"7",label:"maybe"},{value:"18",label:"no"}],r="All seven numbers are the keys in data/scbo/daily/2026-07-28/stats.json (444 bytes). Read the last four carefully. They are the live cumulative set, not tonight's work. Tonight the AI triage saw only the 69 new ads and called 5 OPEN, 64 SKIP; the judge then scored exactly those 5 and returned 2 yes, 0 maybe, 3 no. The other 27 verdicts (5 yes, 7 maybe, 15 no) were folded forward from 24 July by the compile step. The books close: 380 carryover = 353 SKIP + 27 OPEN, so 417 SKIP = 353 + 64 and 32 OPEN = 27 + 5.",i=["Ad A · 67563 · Underground Storage Tank Removal, Rock Hill School District 3. Already a SKIP before tonight.","Ad B · 67670 · *ON CALL TREE REMOVAL GREENVILLE, SCDOT. New tonight, ends YES at 92."],l=[{n:"0",title:"Is this portal due today?",who:"scripts/portal_due.py --batch portals",summary:["Before anything runs, a gate looks at the newest dated folder under data/scbo/daily/ and compares it against the portal's cadence. SCBO is set to cadence 1, so it is due every single day.","Daily matters here. On the two days out of three when the other SC feed (sc-sceis) does not run, SCBO is the only South Carolina source in the batch."],cells:[{label:"In",paths:[{path:"data/scbo/daily/",size:"folder names, 7 of them"},{path:"data/portals/registry.json",size:"cadence_days: 1"}],blocks:[],notes:[],tables:[]},{label:"The registry row that drives the whole night",paths:[],blocks:[`{
 "slug": "scbo",
 "label": "SC Business Opportunities (SCBO)",
 "engine": "scbo",
 "batch": "portals",
 "cadence_days": 1,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Cadence says daily. Reality says 7 archive folders across 18 days (11, 12, 13, 21, 23, 24 and 28 July). The gate does not force a run; it only says the portal may run."],tables:[]}],notes:[],then:"no login, no browser, just 15 form posts"},{n:"1",title:"Pull today's edition",who:"data/scbo/scripts/run_daily.py (step 1) · engine scbo.py",summary:["The site is a plain page that posts back to itself. We post today's date once per category, 15 categories with five posts in flight at a time, split each answer into ad blocks, and read each ad by its printed label (Agency, Bid Number, Opening Date, Contact, and so on).","The published ad is the whole notice. There is no deeper page to fetch, which is why every row is stamped _detail_ok: true at pull time. On this run all 449 rows carry a title, a buyer, a due date, a description and a contact email. Nothing is thin."],cells:[{label:"In → Out",paths:[{path:"https://scbo.sc.gov/online-edition",size:"edition 07-28-2026"},{path:"data/scbo/bids/all-bids.json",size:"572,639 bytes · 449 rows"},{path:"data/scbo/bids/index.json",size:"276 bytes · 15 categories"},{path:"data/scbo/logs/pull_log.txt",size:"23,195 bytes"}],blocks:[`[2026-07-28T22:16:15.598333+00:00] SCBO pull · edition 07-28-2026 · 15 categories
[2026-07-28T22:16:19.131822+00:00] cat 3 Construction 122 ads
[2026-07-28T22:16:20.812753+00:00] cat 11 Services 130 ads
[2026-07-28T22:16:21.001426+00:00] cat 15 Notices/Cooperative Purchasing 0 ads (+3 UNTITLED blocks skipped — verify L_TITLE aliases)
[2026-07-28T22:16:22.403058+00:00] cat 121 Sole Source and Emergency 0 ads (+74 award/sole-source notices skipped)
[2026-07-28T22:16:22.449748+00:00] snapshot: 449 open ads (0 past-due dropped)`],notes:[],tables:[]},{label:"Real record Ad A",paths:[],blocks:[`{
 "bid_id": "67563",
 "title": "Underground Storage Tank Removal
 and Disposal",
 "buyer": "Rock Hill School District 3",
 "state": "SC",
 "due_date": "2026-08-18",
 "due_time": "10:00am",
 "posted_date": "2026-07-22",
 "solicitation_number": "26-2703",
 "category": "Environmental Remediation",
 "description": "Description: The district is
 seeking services to remove of and dispose
 of underground fuel tanks located at our
 operations site. · Documents from:
 http://www.bidnetdirect.com//rockhillschools",
 "contact_name": "William Faris",
 "contact_email": "wfaris@rhschools.org",
 "contact_phone": null,
 "source_url": "https://scbo.sc.gov/printad?a=67563",
 "detail_url": "https://scbo.sc.gov/printad?a=67563",
 "status": "open",
 "_detail_ok": true,
 "documents_source_url": "http://www.bidnetdirect.com//rockhillschools",
 "documents_note": "solicitation files are hosted
 off-portal by the agency; SCBO publishes
 only the ad"
}`],notes:["No blank box for the missing files. Where the ad names a place to get them, we store the pointer and the reason."],tables:[]},{label:"One of the 31 ads that does carry files (fields trimmed to the document block)",paths:[],blocks:[`{
 "bid_id": "67648",
 "title": "Technical Innovation Center",
 "documents": [
 {
 "file_name": "SE-210_H58-6384-JM.pdf",
 "file_url": "https://scbo.sc.gov/files/scbo/SE-210_H58-6384-JM.pdf",
 "file_description": "SCBO solicitation ad / project details"
 }
 ]
}`],notes:[],tables:[]}],notes:[`The document split, counted on this snapshot. 362 of 449 ads (80.6%) point at the agency's own website. 56 ads (12.5%) name no source at all and get the note "SCBO ad names no document source; request the packet from the buyer contact". And 31 ads (6.9%) carry a real file list, every file hosted at scbo.sc.gov/files/scbo/*.pdf. The three add up to 449 exactly. The model doc said these percentages had never been re-derived from a snapshot. Now they have: the "~7% with an on-portal PDF" claim holds, the "~74% off-portal" figure is low, and the real number is 80.6%.`],then:"today's 449 ads meet yesterday's memory"},{n:"2",title:"Work out what is actually new",who:"data/scbo/scripts/run_daily.py (step 2) · platform_sweep.py",summary:["Today's ad ids are compared against the newest earlier archive. An ad we have seen keeps its old decision and becomes carryover. Only genuinely new ad ids are sent to the AI.","That is why 449 ads cost only 69 AI reads. The prior archive held 420 ids; 380 of them are still live, so 40 ads dropped out of the newspaper between 24 and 28 July, and 69 new ones appeared."],cells:[{label:"In → Out",paths:[{path:"data/scbo/bids/all-bids.json",size:"449 rows"},{path:"data/scbo/daily/2026-07-24/triage.json",size:"420 prior ids"},{path:"data/scbo/runs/triage-input.json",size:"14,248 bytes · 69 rows"},{path:"data/scbo/runs/triage-carryover.json",size:"39,066 bytes · 380 rows"},{path:"data/scbo/runs/judge-input.json",size:"417,462 bytes · 449 rows"},{path:"data/scbo/runs/_funnel.json",size:"156 bytes"}],blocks:[],notes:["Ad A takes the carryover door. It is one of the 380. Its SKIP was decided on an earlier night and is simply copied forward. It still gets a description block written into the 449-row judge-input.json, because prep builds that file for every ad, not only the open ones."],tables:[]},{label:"Real record Ad B, new tonight",paths:[],blocks:[`{
 "idx": 268,
 "bid_id": "67670",
 "title": "*ON CALL TREE REMOVAL GREENVILLE",
 "buyer": "Department of Transportation",
 "state": "SC",
 "due_date": "2026-08-24"
}`,`{
 "idx": 0,
 "bid_id": "67563",
 "decision": "SKIP",
 "reason": "UST tank removal = hazmat,
 wrong vertical"
}`],notes:["Watch idx. Ad B is idx 268 inside a file of 69 rows, because idx is the ad's place in the full 449-row snapshot, not its place in this file. Anything that joins on idx across files will be wrong."],tables:[]}],notes:['Re-run the same day and you get zero new. The lookup for "newest earlier archive" includes today, so a second run on the same date diffs to nothing and simply recompiles from carryover.'],then:"69 titles go to the AI, no keyword filter in front of it"},{n:"3",title:"Pass 1: open it or drop it",who:"max-triage · AI (dispatched agent writes the file)",summary:["An AI reads each new ad's title and buyer and answers OPEN or SKIP. The default is SKIP. OPEN needs a plain LGS word (tree, debris, vegetation, right of way, clearing, mowing, brush, stump, storm, disaster, drainage) or a vague utility or on-call town title worth a second look.","Tonight: 5 OPEN, 64 SKIP out of 69."],cells:[{label:"In → Out",paths:[{path:"data/scbo/runs/triage-input.json",size:"69 rows"},{path:"data/scbo/runs/triage-verdicts.json",size:"8,096 bytes · 69 rows"}],blocks:[],notes:[`This file has no code writer. Python only ever blanks it. platform_sweep.py:98, inside the same prep call as stage 2, overwrites it with [] at the start of every run, along with judge-verdicts.json and judge-input-open.json — a deliberate anti-stale fix, because leaving a prior run's rows in place had already mis-stamped other portals. run_daily.py:32 does the same again on a zero-new night; tonight had 69, so that line never ran. Every actual row comes from the dispatched agent, and the model doc marks that write "no code evidence". If no agent runs, the file exists, is empty, and the pipeline keeps going as if every new ad were undecided.`],tables:[]},{label:"Real record Ad B, opened",paths:[],blocks:[`{
 "idx": 268,
 "bid_id": "67670",
 "decision": "OPEN",
 "reason": "DOT on-call tree removal"
}`,`67666 RFQ
67651 On-Call Tree Trimming, Removal &
 Stump Grinding Services
67670 *ON CALL TREE REMOVAL GREENVILLE
67647 Athletic Field Turf Management
67643 Lawn Maintenance Services`],notes:['The first one, id 67666, has the literal title "RFQ". It is opened because a title that says nothing cannot be safely dropped. The judge later scored it 4.'],tables:[]}],notes:[],then:"the step that does nothing, on purpose"},{n:"4",title:"Enrich the OPENs: nothing to do",who:"ps.enrich_opens(PORTAL, config, open_ids)",summary:["On most portals this is where a browser goes and fetches the real scope. Here the call returns 0 and no file is written. The engine defines no detail fetcher at all.","This is not a gap. The proof is in the snapshot: all 449 rows have _detail_ok: true and all 449 have a non-empty description straight from the pull. The ad in the newspaper is the notice. There is nothing deeper to go and get."],cells:[{label:"In → Out",paths:[{path:"data/scbo/runs/triage-verdicts.json",size:"the 5 OPEN ids"},{path:"nothing written",size:"returns int 0"}],blocks:[],notes:["There is no scripts/_phase4_enrich.py in this portal's folder. The registry says enrich_passes: []. Both agree with each other and with the files."],tables:[]},{label:"Snapshot coverage, counted across all 449 rows",paths:[],blocks:[],notes:[],tables:[[{header:!0,cells:["Field","Rows filled"]},{header:!1,cells:["description","449 of 449 (100%)"]},{header:!1,cells:["contact_name","449 of 449 (100%)"]},{header:!1,cells:["contact_email","449 of 449 (100%)"]},{header:!1,cells:["due_date","449 of 449 (100%)"]},{header:!1,cells:["solicitation_number","375 of 449 (83.5%)"]},{header:!1,cells:["documents[]","31 of 449 (6.9%)"]}]]}],notes:[],then:"the OPENs that still have no score are gathered up"},{n:"5",title:"Build the judge's queue",who:"ps.build_judge_input_open(PORTAL)",summary:["This collects every OPEN ad that still has no verdict: tonight's new OPENs plus any older OPEN that was never scored. Each one gets its description rebuilt from the snapshot.","Tonight the queue is exactly the 5 new OPENs. The 27 older OPENs already had verdicts from 24 July, so they are left alone. That is real money saved: 32 open ads, 5 AI calls."],cells:[{label:"In → Out",paths:[{path:"data/scbo/runs/triage-verdicts.json + triage-carryover.json",size:null},{path:"data/scbo/daily/2026-07-24/verdicts.json",size:"30 prior verdicts"},{path:"data/scbo/bids/all-bids.json",size:"for the description"},{path:"data/scbo/runs/judge-input-open.json",size:"4,405 bytes · 5 rows"}],blocks:[],notes:["Note the two judge files: judge-input.json holds all 449 ads and truncates each body to 6KB; judge-input-open.json holds only the 5 to be scored, with the body untruncated. Only the second one is sent to the AI."],tables:[]},{label:"Real record Ad B",paths:[],blocks:[`{
 "idx": 268,
 "bid_id": "67670",
 "title": "*ON CALL TREE REMOVAL GREENVILLE",
 "buyer": "Department of Transportation",
 "state": "SC",
 "due_date": "2026-08-24",
 "detail_url": "https://scbo.sc.gov/printad?a=67670",
 "description_full": "Title: *ON CALL TREE REMOVAL
 GREENVILLE\\nBuyer: Department of Transportation
 \\nState: SC\\nCloses: 2026-08-24\\nSource URL:
 https://scbo.sc.gov/printad?a=67670\\n\\nRFP body:
 Description: SCDOT is soliciting for On-Call
 Tree Removal Services within or near the right
 of way limits on SCDOT maintained roads and
 routes in Greenville County. This will include
 cutting and leaving, cutting and removing, and
 cutting, removing, stump grinding and traffic
 control at the direction of the Resident
 Maintenance Engineer (RME) or designee. ·
 Pre-Bid Information: NONE · Documents from:
 https://apps.sceis.sc.gov/SCSolicitationWeb/…"
}`],notes:["Real scope, from the ad itself. Unlike some SC feeds, this description is genuinely filled at pull time, so the judge reads work words and not just a title."],tables:[]}],notes:[],then:"five ads get a full read and a score"},{n:"6",title:"Pass 2: would LGS bid this?",who:"max-bid-judge · AI (dispatched agent writes the file)",summary:["Yes, maybe or no, a score out of 100, a reason, and lists of good and bad signals. Tonight's five came back 2 yes, 0 maybe, 3 no: 67670 at 92, 67651 at 90, then 67647 at 15, 67643 at 12 and 67666 at 4.","Every yes and maybe from this portal is flagged out_of_core_state, because South Carolina sits outside LGS's eight home states. The flag is a note for the operator, not a rejection."],cells:[{label:"In → Out",paths:[{path:"data/scbo/runs/judge-input-open.json",size:"5 rows"},{path:"data/scbo/runs/judge-verdicts.json",size:"7,391 bytes · 5 rows"}],blocks:[],notes:["Same missing writer as Pass 1. platform_sweep.py:98 blanks judge-verdicts.json at the start of every run and the agent fills it; run_daily.py:34 would create it empty on a zero-new night, and tonight that line never ran. Two of the most important files in this portal's night are produced by no Python code anywhere in the repo.",`The judge knew it was a twin. Ad B's verdict carries a cross_portal block saying this is the same solicitation as sc-sceis:5400030004, that the verdict was inherited rather than re-judged, and that the SCEIS copy carries more scope: the three-year term, the five-year experience requirement, the questions deadline, the bonding position and the 24/7 call-out clause. Its plain instruction: "Bid from the SCEIS copy."`],tables:[]},{label:"Real record Ad B, YES at 92",paths:[],blocks:[`{
 "bid_id": "67670",
 "title": "*ON CALL TREE REMOVAL GREENVILLE",
 "buyer": "Department of Transportation",
 "state": "SC",
 "would_lgs_bid": "yes",
 "score": 92,
 "category": "state DOT on-call tree removal (ROW)",
 "primary_reason": "State DOT three-year on-call
 tree removal, stump grinding and debris
 disposal in the highway right-of-way with
 24/7 emergency call-outs - the exact
 contract shape LGS wins.",
 "service_match": "core",
 "scale_match": "above_floor",
 "buyer_match": "core",
 "red_flags": [
 "cross_portal_duplicate",
 "mandatory_5yr_tree_removal_experience_plus_5_references",
 "out_of_core_state"
 ],
 "fit_signals": [
 "state_dot_row_tree_removal",
 "three_year_on_call_unit_price",
 "stump_grinding_and_debris_disposal",
 "24_7_emergency_call_outs"
 ],
 "kansas_city_risk": false,
 "closed_award": false,
 "cross_portal": {
 "status": "duplicate_not_rejudged",
 "same_solicitation_as": "sc-sceis:5400030004",
 "verdict_inherited_from": "sc-sceis 2026-07-28
 verdicts.json",
 "scope_comparison": "SCBO carries LESS scope
 than SCDOT/SCEIS: SCBO publishes only the
 one-paragraph ad (scope sentence + contact
 + due date). sc-sceis enriched from the
 53-page SOLICITATION.pdf and adds…"
 }
}`],notes:[],tables:[]}],notes:[],then:"new work and old memory are merged into one durable folder"},{n:"7",title:"Write the day's archive",who:"ps.compile_archive(PORTAL, config)",summary:["Carryover plus tonight's decisions become one 449-row decision list. Old verdicts for ads still in the newspaper are folded forward. Two different verdict key shapes exist in the wild, so both are straightened out here into one shape.","This fold-forward is the portal's carry-forward. 27 of tonight's 32 verdicts came from 24 July; all 27 ids were checked and found in that day's file. Five are brand new."],cells:[{label:"Out · data/scbo/daily/2026-07-28/",paths:[],blocks:[],notes:[`new-bids.json is not "new bids". It is the whole 449-row snapshot, byte-for-byte the same size as bids/all-bids.json. The name is left over from portals where the file really does hold only the night's arrivals. Anyone counting rows here to get "new tonight" gets 449 instead of 69.`,"Plus one row appended to data/scbo/daily/INDEX.md: | 2026-07-28 | 449 | 69 | 32 | 7 | 7 | 18 |."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","449 rows, the full snapshot","572,639 B"]},{header:!1,cells:["triage.json","449 decisions: 417 SKIP, 32 OPEN","47,159 B"]},{header:!1,cells:["verdicts.json","32 live verdicts: 7 yes, 7 maybe, 18 no","35,218 B"]},{header:!1,cells:["stats.json","the funnel counts","444 B"]},{header:!1,cells:["report.md","the human summary","5,969 B"]}]]},{label:"Real record Ad B in verdicts.json",paths:[],blocks:[`{
 "bid_id": "67670",
 "title": "*ON CALL TREE REMOVAL GREENVILLE",
 "buyer": "Department of Transportation",
 "would_lgs_bid": "yes",
 "score": 92,
 "due_date": "2026-08-24",
 "source_url": "https://scbo.sc.gov/printad?a=67670",
 "bid_key": "scbo:67670",
 "verdict": "yes"
}`,`{
 "idx": 0,
 "bid_id": "67563",
 "decision": "SKIP",
 "reason": "UST tank removal = hazmat,
 wrong vertical"
}`],notes:["Compile adds the two keys the rest of the system needs: bid_key and a plain verdict alongside the judge's would_lgs_bid.","Its whole cost tonight: it was pulled, matched against yesterday, and copied. No AI read it."],tables:[]}],notes:[],then:"the portal's own night is over; the shared machinery takes over"},{n:"8",title:"Shared carry-forward: skips this portal on purpose",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`Across all portals there is a safety net that rescues verdicts for bids that fell out of one night's pull. Run with --all it only touches portals whose registry entry says carry_forward: "orchestrator".`,`SCBO says "engine-internal". That means no. The script never opens this portal's archive. And that is correct, because stage 7 already merged the prior verdicts. Running the shared net here would apply the same fold twice.`],cells:[{label:"The proof that it has never run here",paths:[],blocks:[],notes:["The shared script leaves a file called _carryforward_audit.json in any archive folder it touches. There is no such file anywhere under data/scbo/daily/. The one other South Carolina feed, sc-sceis, does have one, dated 2026-06-23 — and it is engine-internal too. The registry gate only holds for --all; naming a portal with --portal skips the gate and runs it anyway (carry_forward_verdicts.py:241 versus :255). SCBO has never been named that way."],tables:[]}],notes:[],then:"ledgers, reports and the board's input files"},{n:"9",title:"Ledger, report, fixtures",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared scripts read the archive that stage 7 just wrote. The first walks every dated verdicts.json this portal has ever written and folds the YES rows into the all-portal ledger. The second rewrites report.md into the one shared layout every portal uses. The third builds the file the board publisher reads.","Only YES reaches the board fixture. MAYBE stays in the archive. That is one line of code and it decides a lot further down."],cells:[{label:"In → Out",paths:[{path:"data/scbo/daily/*/verdicts.json",size:"all 7 dates"},{path:"data/portals/cumulative-yes.json + .md",size:null},{path:"data/scbo/daily/2026-07-28/report.md",size:"rewritten, 5,969 B"},{path:"PortalPro/src/fixtures/portal-bids.json",size:null},{path:"PortalPro/src/fixtures/activity-matrix.json",size:null}],blocks:[],notes:[],tables:[]},{label:"The rewritten report, top of the YES list (verbatim)",paths:[],blocks:[`## YES — Max would bid

- **[92] *ON CALL TREE REMOVAL GREENVILLE** — Department of Transportation · closes 2026-08-24
 State DOT three-year on-call tree removal, stump grinding and debris disposal in the highway right-of-way with 24/7 emergency call-outs - the exact contract shape LGS wins. _flags: cross_portal_duplicate, mandatory_5yr_tree_removal_experience_plus_5_references, out_of_core_state_
 link: https://scbo.sc.gov/printad?a=67670`],notes:["The report footer stamps Standardized report · regenerated 2026-07-28T22:37:29+00:00, eleven minutes after stats.json was written. The file on disk is this version, not the one compile wrote."],tables:[]}],notes:[],then:"the ad stops being an SCBO ad here"},{n:"10",title:"Publish, cluster, dedup",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Every portal's YES rows go into one shared bids table and get grouped into cross-portal clusters. This is the only place where an SCBO ad and the same job on sc-sceis, DemandStar, NAPC, IonWave or BeaconBid can collapse into one row for the operator.",`SCBO is not treated as an aggregator, so its named agency ("Department of Transportation") wins the cluster's display buyer over some marketplace's own label.`],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:null},{path:"data/scbo/daily/2026-07-28/{stats.json, new-bids.json}",size:null},{path:"supabase: bids, clusters, bids.cluster_id, sweep_runs, portals",size:null}],blocks:[],notes:["The twin does not actually merge. The model doc measured it: zero shared clusters between scbo and sc-sceis. The cause is not the dedup logic, it is the YES-only fixture at stage 9. Of tonight's 449 ads only the 7 YES can reach the fixture at all, and on sc-sceis that same night only 2 of 159. The model doc measured the same cut earlier and put it at 411 of the 420 SCBO ads in its 24 July snapshot, and 149 of 152 sc-sceis rows. Either way the 36 colliding titles on the 24 July overlap board never reach the cluster layer. The judge already spotted the duplicate at stage 6 by reading; the machinery never gets the chance."],tables:[]},{label:"Real board card Ad B",paths:[],blocks:[`{
 "id": "424ac96703d34823",
 "portal": "scbo",
 "portal_label": "SC Business Opportunities (SCBO)",
 "source_bid_id": "67670",
 "title": "*ON CALL TREE REMOVAL GREENVILLE",
 "buyer": "Department of Transportation",
 "state": "SC",
 "solicitation_no": "5400030004",
 "federal": false,
 "score": 92,
 "verdict": "yes",
 "contact_name": "TAMIKA THOMAS",
 "contact_email": "THOMASTS@SCDOT.GOV",
 "contact_phone": "864-241-1010 EXT. 6027",
 "red_flags": [
 "cross_portal_duplicate",
 "mandatory_5yr_tree_removal_experience_plus_5_references",
 "out_of_core_state"
 ],
 "fit_signals": [],
 "first_seen": "2026-07-28",
 "last_seen": "2026-07-28",
 "has_documents": false
}`],notes:["Two things went missing on the way. fit_signals arrived empty even though the judge wrote four of them. And has_documents is false, which is true for this ad: its files live on the SCEIS site, not on SCBO."],tables:[]}],notes:[],then:"the board tries to fill what the ad could not"},{n:"11",title:"Documents and requirements",who:"2.85b run_enrichment_phase.py → publish_doc_gaps.py · 2.87 requirements",summary:["This is SCBO's one real contribution to the shared enrichment step, and it is verified in code, not claimed in a skill file. publish_doc_gaps.py names this portal explicitly and reads exactly the two keys the engine writes: documents_source_url and documents_note.","The result is that a bid page says why there are no files instead of showing a blank box. The registry line enrich_passes: [] understates what actually happens here."],cells:[{label:"In → Out",paths:[{path:"data/scbo/bids/all-bids.json",size:"the two document keys"},{path:"supabase: bid_enrichment.field_gaps",size:null},{path:"supabase: portal_field_walls",size:"('scbo','documents') = source_has_none"},{path:"supabase: bid_requirements",size:null},{path:"data/portals/requirements-manifest.json, requirements-output.json",size:null}],blocks:[],notes:['Requirements work on clusters, not single ads. An SCBO ad gets requirements when its cluster has document text. A cluster with no material gets a neutral "no material" row rather than an empty pill.'],tables:[]},{label:"The two gap reasons, exactly as written — 418 of the 449 rows carry one",paths:[],blocks:[`{
 "bid_id": "67102",
 "documents_source_url": "https://cityofmauldin.org",
 "documents_source_raw": "cityofmauldin.org",
 "documents_note": "solicitation files are hosted
 off-portal by the agency; SCBO publishes
 only the ad"
}`,`{
 "documents_note": "SCBO ad names no document
 source; request the packet from the buyer
 contact"
}`],notes:["362 ads carry this note. 28 of them also keep documents_source_raw, the bare hostname the ad printed before we added the https://.","56 ads carry this one. The remaining 31 have real files and no note."],tables:[]}],notes:[],then:"pairs that only became comparable after enrichment"},{n:"12",title:"Dedup, second pass",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Dedup runs again on pairs that were not comparable the first time, because enrichment has since filled in blank buyers, due dates and solicitation numbers.","SCBO is the giving side here. It writes a real solicitation_number on 375 of 449 ads, and for South Carolina that is the strongest match key there is. Ad B's is 5400030004, the same string the SCEIS feed uses as its whole bid id."],cells:[{label:"In → Out",paths:[{path:"supabase: clusters + dedup_adjudications",size:null},{path:"supabase: clusters",size:"final cluster set"}],blocks:[],notes:["An open question worth money. If the SCBO solicitation number and the sc-sceis bid id really are the same string on shared jobs, a plain exact-match join would beat any title matching. It has not been checked against data. And it cannot help while stage 9's YES-only filter is removing the rows before they ever reach here."],tables:[]}],notes:[],then:"what changed, who gets told, did the run finish"},{n:"13",title:"Watch, digests, sentinel",who:"2.88 · watch_list_signals.py · bid_watch.py · new_bids_email.py · alerts_engine.py · pipeline_sentinel.py",summary:["Watch mode is none for this portal, so no page is re-visited to look for changes. Its bids still reach the daily digests through their shared clusters."],cells:[{label:null,paths:[],blocks:[],notes:["Addenda are a blind spot. A South Carolina agency that changes a due date or posts an amendment after the ad runs will not be noticed by us until the next day's edition reprints the ad. Nothing is watching this portal between pulls."],tables:[[{header:!1,cells:["Re-capture the page and diff it","not done here, registry watch = none"]},{header:!1,cells:["Digest files data/portals/daily-new-bids.md, daily-watch-digest.md","written; SCBO appears through its clusters"]},{header:!1,cells:["Actually sending the mail","silently does nothing until RESEND_API_KEY exists in data/auth/resend.env"]},{header:!1,cells:["Sentinel data/portals/sentinel.json","checks every portal finished every phase"]}]]}],notes:[],then:"packs, boards, and the two numbers everyone quotes"},{n:"14",title:"Packs, boards, the terminals",who:"2.89 build_bidpack.py · 2.9-2.96 build_portal_metrics.py, build_monitor_html.py, build_portals_overview.py, goalstate_matrix.py · P3-P4 roll-up + scorecard.py",summary:["Bid packs render one markdown folder per keyed cluster; an SCBO ad shows up as a page inside its cluster's pack. The operator boards are rebuilt from the durable archives, and SCBO becomes one row on each. Finally the run roll-up reads this portal's stats.json, verdicts.json and triage.json, and the scorecard logs the board-level numbers straight out of the database."],cells:[{label:"Out",paths:[{path:"data/bidpacks/{pack_key}/",size:null},{path:"data/portals/metrics.json · overlap.json · monitor.html · overview.html",size:null},{path:"data/portals/daily/2026-07-28/roll-up.md",size:null},{path:"data/portals/daily/<date>/goalstate-matrix.md",size:"not written on 07-28; newest is 2026-07-24"},{path:"data/portals/scorecard.csv",size:null}],blocks:[],notes:["A missing stats.json marks the portal FAILED in the roll-up. This one has it, 444 bytes, generated 22:26:06 UTC."],tables:[]},{label:"SCBO is the most collided portal on the overlap board",paths:[],blocks:[],notes:["109 title collisions in total, summed from the six pairs in data/portals/overlap.json, which was last generated on 2026-07-24 and has not been rebuilt since. Only the sc-sceis pair was measured for cluster merges, and it came back zero. The overlap board can see duplication that the cluster layer never gets to act on."],tables:[[{header:!0,cells:["Colliding with","Titles"]},{header:!1,cells:["demandstar","38"]},{header:!1,cells:["sc-sceis","36"]},{header:!1,cells:["napc","15"]},{header:!1,cells:["ionwave","12"]},{header:!1,cells:["beaconbid","7"]},{header:!1,cells:["commbuys","1"]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","What it costs"]},{header:!1,cells:["triage-verdicts.json and judge-verdicts.json have no code writer. Python only blanks them: platform_sweep.py:98 resets both (plus judge-input-open.json) to [] on every run; run_daily.py:32 and :34 repeat that on a zero-new night. A dispatched AI agent writes every actual row.",'If the agent does not run, the files exist and are empty, and the night quietly produces zero decisions with no error. The model doc marks both writes "no code evidence" — and its own stage-3 output list misses the platform_sweep.py:98 blanking altogether, so the baseline map does not show where these files really get touched.']},{header:!1,cells:["The funnel keys triage.open and scoring in stats.json are the live cumulative set, not the night's work.",'"32 open, 7 yes" reads like tonight. Tonight was 5 open and 2 yes. Quoting stats.json as nightly output overstates the run by six times.']},{header:!1,cells:["new-bids.json holds the whole 449-row snapshot, not the new bids.",'Same byte size as all-bids.json. Counting its rows to answer "how many new tonight" gives 449 instead of 69.']},{header:!1,cells:["idx is the ad's place in the 449-row snapshot, not its place in the file it sits in.","Ad B is idx 268 inside a 69-row file. Any join on idx across two files silently picks the wrong ad."]},{header:!1,cells:["The inspect file's field list for all-bids.json shows 19 keys and misses documents and documents_source_raw.","It sampled one row. Reading that list alone tells you SCBO never captures a file, when in fact 31 ads do."]},{header:!1,cells:["Document numbers disagree across three places. PORTAL.md (a 2026-07-14 draft) says 0% coverage; the skill says ~7% on-portal PDFs and ~74% off-portal; the snapshot says 6.9% / 80.6% / 12.5% no-source.",`PORTAL.md's figure sits next to board-level numbers ("surfaced YES/MAYBE live: 6") and the one YES card on the board does have has_documents: false, so board-level 0% and snapshot-level 6.9% can both be true. They measure different things and nothing on either page says so.`]},{header:!1,cells:["data/scbo/PORTAL.md says batch standalone; the registry says portals.",'The registry is right and the runbook is a stale auto-generated draft: almost every field in it still reads TODO. Do not use it to answer "how do we drive this portal".']},{header:!1,cells:['The 07-28 pull skipped 3 UNTITLED blocks with the log line "verify L_TITLE aliases".',"A live alarm on the anchor run. It means the site printed a title under a label we do not recognise yet. It is counted, never dropped silently, but nobody has acted on it. The 07-24 pull logged 4."]},{header:!1,cells:["74 award and sole-source notices were dropped at pull.","By design, they are not biddable. Worth knowing when the site's own ad count does not match ours."]},{header:!1,cells:['The judge knows Ad B is the sc-sceis twin and says "Bid from the SCEIS copy", but the board shows zero shared clusters between the two portals.',"Not a dedup bug. The YES-only fixture at stage 9 passes only the YES rows — 7 of tonight's 449; the model doc measured the same cut on 24 July at 411 of 420 — so the 36 colliding titles on that day's overlap board never reach the cluster layer."]},{header:!1,cells:["fit_signals is [] on the published board card, while runs/judge-verdicts.json has four entries for the same ad.","An unexplained mismatch, not a traced defect. The three red flags survived the same trip and the four positives did not. Where they are lost was not followed through the fixture dump."]},{header:!1,cells:["Three orphan files: runs/_scbo_chunk1.json, chunk2, chunk3, 136 rows each, 23,091 / 22,617 / 23,016 bytes.","Hand-made slices of a triage input from the 2026-07-11 onboarding day, when ~400 ads had to be split across parallel agents. No Python writes them. Harmless, but nothing cleans them up."]},{header:!1,cells:["Cadence says every day; there are 7 archive folders across 18 days.","Missed days pile up as a bigger new-ad batch. 40 ads also fell out of the newspaper between 24 and 28 July, unnoticed."]},{header:!1,cells:["Watch mode is none and emails are dead until RESEND_API_KEY exists.","A changed due date or an amendment is invisible to us until the next edition reprints the ad."]},{header:!1,cells:["Not a wall: there is no login and no detail page. The ad is the whole notice.","All 449 rows have a description, a contact name and a contact email. The only thing SCBO genuinely cannot give us is the file itself, and that gets a written reason instead of a blank."]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the file named beside it; every count traces to data/scbo/daily/2026-07-28/stats.json, a row count, a byte size, or a line of data/scbo/logs/pull_log.txt. The 6.9% / 80.6% / 12.5% document split and the per-field coverage table were counted directly over the 449 rows of data/scbo/bids/all-bids.json. Baseline map: docs/portal-dataflow/scbo.md (evidence-cited to file:line). Companion pages: Portal pedia · 44 (sc-sceis, the twin feed) and Portal pedia · 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the file named beside it; every count traces to data/scbo/daily/2026-07-28/stats.json, a row count, a byte size, or a line of data/scbo/logs/pull_log.txt. The 6.9% / 80.6% / 12.5% document split and the per-field coverage table were counted directly over the 449 rows of data/scbo/bids/all-bids.json. Baseline map: docs/portal-dataflow/scbo.md (evidence-cited to file:line). Companion pages: Portal pedia · 44 (sc-sceis, the twin feed) and Portal pedia · 02 (DemandStar).",c="docs/portal-dataflow/pedia-scbo.html",p={slug:e,title:t,eyebrow:s,headline:a,lede:n,funnel:o,funnel_note:r,legend:i,stages:l,sections:d,footer:h,source_page:c};export{p as default,s as eyebrow,h as footer,o as funnel,r as funnel_note,a as headline,n as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};
