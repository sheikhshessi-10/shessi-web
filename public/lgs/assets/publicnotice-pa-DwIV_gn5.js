const e="publicnotice-pa",t="Public Notice PA: what happens to a notice, stage by stage",a="Portal pedia · 39",s="Public Notice PA: what happens to a legal notice, from a newspaper search box to the board",n="This is not a bid portal. It is Pennsylvania's newspaper legal-notice board, mostly estates and foreclosures, so we type ten work phrases into its search box and keep whatever comes back. Every stage below is from the run of 28 July 2026, with a real record read off disk at each step. The portal runs on a three-day beat, so 133 of the 145 notices arrived already decided. The real work of the night was 12 new notices, and they produced exactly one new YES.",o=[{value:"145",label:"in snapshot"},{value:"133",label:"carried over"},{value:"12",label:"new to triage"},{value:"34",label:"triage open · all live"},{value:"111",label:"triage skip · all live"},{value:"9",label:"yes · all live"},{value:"9",label:"maybe · all live"},{value:"16",label:"no · all live"}],i="Every number above is a key in data/publicnotice-pa/daily/2026-07-28/stats.json (463 bytes). Read the last five cells carefully. The open, skip, yes, maybe and no counts cover the whole live snapshot of 145 notices, not the 12 that were new. They are what the archive holds after old decisions are merged back in. Never add scoring.yes into an all-portal total.",r=["Notice A · 2436610 · Estate Notice, Centre Daily Times. New tonight, dies at Pass 1.","Notice B · 2435381 · Tree Trimming and Removal, Allegheny County Housing Authority. New tonight, ends YES at 80."],l=[{n:"1",title:"Is this portal due tonight?",who:"python scripts/portal_due.py --batch portals",summary:["The gate looks at the newest dated folder under data/publicnotice-pa/daily/. If it is three or more days old, the portal is due and gets a sweep. Otherwise it is skipped and nothing is lost, because every later stage only looks at what is new.","The live cadence number comes from the shared board, not from the file. The registry's cadence_days: 3 is the cold-start fallback."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"the portal's row"},{path:"data/publicnotice-pa/daily/*",size:"33 dated folders"}],blocks:[],notes:[],tables:[]},{label:"The last five folders on disk",paths:[],blocks:[`2026-07-09
2026-07-10
2026-07-12
2026-07-13
2026-07-16
2026-07-20
2026-07-23
2026-07-28 <- this run`],notes:["The beat is mostly three days. The last gap is five. The files say the run happened on the 28th and not on the 26th. They do not say why."],tables:[]}],notes:[],then:"the slug is printed as due, so a child agent is started"},{n:"2",title:"A child agent takes the portal",who:"Agent(general-purpose) · .claude/skills/publicnotice-pa-sweep/SKILL.md",summary:["The orchestrator hands the whole sweep to one child agent, which reads the runbook and runs it end to end, from the pull down to the compiled archive. The pull takes about fifty seconds, so it is not on the heavy-pull list and runs in parallel with the rest of its batch.","Its twin, publicnotice-tn, runs on the same engine in the same batch. Both open their own headless browser at nearly the same moment."],cells:[{label:"In",paths:[{path:".claude/skills/publicnotice-pa-sweep/SKILL.md",size:"the runbook"}],blocks:[],notes:[],tables:[]},{label:"Out",paths:[{path:"a running child agent",size:"owns everything through compile"}],blocks:[],notes:["If the child fails, the roll-up marks this portal FAILED and the rest of the batch carries on."],tables:[]}],notes:[],then:"ten searches, one headless browser, about fifty seconds"},{n:"3",title:"Type ten phrases into the search box",who:"data/publicnotice-pa/scripts/run_daily.py · step 1: ps.pull",summary:["The search is an old-style form that only answers a real click, so a headless browser drives it. Ten phrases go in one at a time and every row of the results table becomes a bid. The row's id is the bid id, the search snippet is the whole description, and the title and the buyer are guessed out of that snippet with pattern matching.","There is no second page. Each phrase returns at most the fifty freshest notices."],cells:[{label:"In → Out",paths:[{path:"https://www.publicnoticepa.com/Search.aspx",size:"10 phrases from config.json"},{path:"data/publicnotice-pa/bids/all-bids.json",size:"118,232 bytes · 145 rows"},{path:"data/publicnotice-pa/bids/index.json",size:"502 bytes"},{path:"data/publicnotice-pa/logs/pull_log.txt",size:"one line per phrase"}],blocks:[`[2026-07-28T21:05:38…] 'tree removal': 43 notices over 1 page(s)
[2026-07-28T21:05:41…] 'tree trimming': 15 notices over 1 page(s)
[2026-07-28T21:05:43…] 'debris removal': 21 notices over 1 page(s)
[2026-07-28T21:05:45…] 'vegetation management': 3 notices over 1 page(s)
[2026-07-28T21:05:47…] 'mowing': 18 notices over 1 page(s)
[2026-07-28T21:05:49…] 'brush': 25 notices over 1 page(s)
[2026-07-28T21:05:51…] 'stump removal': 12 notices over 1 page(s)
[2026-07-28T21:05:54…] 'land clearing': 50 notices over 1 page(s)
[2026-07-28T21:05:56…] 'right-of-way clearing': 1 notices over 1 page(s)
[2026-07-28T21:06:10…] 'storm debris': no results
[2026-07-28T21:06:12…] wrote 145 keyword-matched notices`],notes:[],tables:[]},{label:"Real record Notice B",paths:[],blocks:[`{
 "bid_id": "2435381",
 "title": "FOR BIDS (IFB) ACHA-1729 ? Tree
 Trimming and Removal Services The Allegheny",
 "buyer": "Removal Services The Allegheny County",
 "state": "PA",
 "due_date": null,
 "publication": "Pittsburgh Post-Gazette",
 "published": null,
 "status": "Open",
 "detail_url": "https://www.publicnoticepa.com/
 Details.aspx?SID=2435381",
 "description": "49707/26/2026https://www.post-
 gazette.com/PublicNoticesALLEGHENY COUNTY HOUSING
 AUTHORITY INVITATION FOR BIDS (IFB) ACHA-1729 ?
 Tree Trimming and Removal Services The Allegheny
 County Housing Authority (ACHA) invites sealed
 bids from qualified firms to provide Tree Trimming
 and Removal Services at v ... click 'view' to open
 the full text.",
 "_detail_ok": true,
 "_keywords": ["tree removal", "tree trimming"]
}`],notes:[`Three things are visible in that one row. The buyer is wrong, and it is wrong in a readable way: the guesser grabbed the words just before "County". The description starts with the newspaper's own page furniture, 49707/26/2026https://www.post-gazette.com/PublicNotices, glued straight onto the notice. And the ? before "Tree Trimming" is a dash the scraper could not read. All three are in the file exactly as printed here.`],tables:[]}],notes:['The fifty cap is binding, and has been all along. The settings are fifty results per phrase and one page per phrase. "land clearing" came back with exactly 50 on this run, and on 40 of the 41 runs recorded in logs/pull_log.txt. Anything older than the newest fifty for that phrase is invisible to us, permanently. "tree removal" at 43 is one busy week from the same wall. At the other end, "storm debris" has returned "no results" on every run in the log.'],then:"the snapshot is compared with the last archived day"},{n:"4",title:"Split the new from the already-decided",who:"run_daily.py · step 2: ps.prep",summary:["Each notice is keyed by its id. If the most recent archived day already holds a decision for it, that decision is copied straight across. Everything else goes on the new list. A fat record for the judge is also built for every notice, new or not.","On a three-day beat the carry-over file does three days of work at once. Tonight it carried 133 of 145."],cells:[{label:"In → Out",paths:[{path:"bids/all-bids.json",size:"145 rows"},{path:"daily/2026-07-23/triage.json",size:"142 ids to compare against"},{path:"runs/triage-input.json",size:"2,711 bytes · 12 rows"},{path:"runs/triage-carryover.json",size:"17,969 bytes · 133 rows"},{path:"runs/judge-input.json",size:"131,188 bytes · 145 rows"},{path:"runs/_funnel.json",size:"156 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 145,
 "carryover_count": 133,
 "triage_input_count": 12,
 "prior_archive_ids_compared_against": 142
}`],notes:["The arithmetic closes: 12 + 133 = 145 = the snapshot = the rows in tonight's archived triage file."],tables:[]},{label:"Real record Notice A, on the new list",paths:[],blocks:[`{
 "idx": 71,
 "bid_id": "2436610",
 "title": "Estate Notice",
 "buyer": "Centre Daily Times",
 "state": "PA",
 "due_date": null
}`,`{
 "idx": 0,
 "bid_id": "2432698",
 "decision": "SKIP",
 "reason": "public hearing notice, no work verb",
 "title": "Notice is hereby given that on Monday,
 August 31, 2026, the McKean County Board of
 Commissioners will hold a Public Hearing at
 6:00PM. The p"
}`],notes:["A dead person's estate, matched by one of our work phrases. Its buyer is the newspaper, because there was no agency name to find. This is what the board is mostly made of.","Decided on an earlier day, copied across for free. This is the only file in this run that holds it as a decision."],tables:[]}],notes:["Re-running the same day costs nothing. The comparison includes today's own archive, so a second run on 28 July would find zero new notices and change nothing."],then:"twelve titles go to the first AI pass"},{n:"5",title:"Pass 1: open it or drop it",who:"max-triage · AI, then the child agent writes the file",summary:["Twelve notices, screened on the title and the little that comes with it. The default answer is SKIP. OPEN needs a real work verb, or a municipal notice cryptic enough to deserve a second look.","Result: 7 OPEN, 5 SKIP. Pennsylvania is outside the eight core states, so the rule here is to surface a good bid with an out-of-core flag rather than reject it on geography."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"12 rows"},{path:"runs/triage-verdicts.json",size:"3,027 bytes · 12 rows"}],blocks:[`{
 "idx": 71,
 "bid_id": "2436610",
 "decision": "SKIP",
 "reason": "Estate notice for a deceased
 individual; not a procurement solicitation",
 "title": "Estate Notice - Estate of Roger J. Boob"
}`],notes:["Notice A's journey ends here. One title read is its total cost."],tables:[]},{label:"Real record Notice B · opened",paths:[],blocks:[`{
 "idx": 4,
 "bid_id": "2435381",
 "decision": "OPEN",
 "reason": "Housing authority invitation for bids,
 tree trimming and removal at multiple sites",
 "title": "Tree Trimming and Removal Services
 (IFB ACHA-1729) - Allegheny County Housing
 Authority"
}`],notes:[`The AI quietly repairs the title. Compare the title that went in at stage 3 with the one that came out here. The scraper's guess was "FOR BIDS (IFB) ACHA-1729 ? Tree Trimming and Removal Services The Allegheny". Pass 1 wrote a clean one. It does this to every row: "North Street" came back as "Ordinance Adoption Notice - Borough of Berlin Council". Good for the reader, but the title on the board is now written by a language model, not read off the page, and nothing in the code says so.`],tables:[]}],notes:[],then:"the opens would normally go and fetch their detail page"},{n:"6",title:"Enrich the opens: a hard nothing",who:"ps.enrich_opens → publicnotice_lrs.enrich_details",summary:["On other portals this stage opens each promising bid and reads the full page. Here it returns zero without touching the network, because there is nothing to fetch. The site's detail page only renders after a click inside the search form. Asking for the address directly gives you the site's menu and a bot challenge, not the notice.","So the roughly 300-character search snippet is the description, forever. Everything downstream is reasoning about that snippet."],cells:[{label:"What a later stage actually captured from that detail page (bid pack for notice 2367892)",paths:[],blocks:[`Source URL: https://www.publicnoticepa.com/Details.aspx?SID=2367892
Captured by: rendered:fields
Chars: 883
---
DOCUMENTS: usalegalnotice.com

Public Notice Pennsylvania | Pennsylvania NewsMedia Association Back
Smart Search Sign In About Smart Search About Public Notices
Publications --> Help Home About Us | About Public Notices |
Publications | --> Help Smart Search Sign-in For more Public Notices
visit: usalegalnotice.com Back > Search Results > Public Notice Detail
Back To Results Back You must complete the challenge in order to
continue. Copyright &copy; 2011 Pennsylvania NewsMedia Association…`],notes:["Read from data/bidpacks/pa-borough-of-westmont-shade-tree-emergency-misc-trimming-annual-borough-of-west-103fa7/page-publicnotice-pa.md. 883 characters of menu and a bot challenge. That is the proof that this wall is real and not a missing feature."],tables:[]}],notes:[],then:"build the list of notices that still need a score"},{n:"7",title:"Who still needs a verdict?",who:"ps.build_judge_input_open",summary:["Tonight's opens, plus any older open that somehow never got scored. Anything already scored is left alone, which is what keeps the cost flat as the archive grows.","Tonight the answer was clean: 7 rows, all of them tonight's opens. The other 27 opens in the live set already had verdicts from earlier days."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"tonight's 7 opens"},{path:"runs/triage-carryover.json",size:"133 carried decisions"},{path:"daily/2026-07-23/verdicts.json",size:"who already has a score"},{path:"runs/judge-input-open.json",size:"6,659 bytes · 7 rows"}],blocks:[],notes:[],tables:[]},{label:"Real record Notice B, as the judge will see it",paths:[],blocks:[`{
 "idx": 4,
 "bid_id": "2435381",
 "title": "FOR BIDS (IFB) ACHA-1729 ? Tree Trimming
 and Removal Services The Allegheny",
 "buyer": "Removal Services The Allegheny County",
 "state": "PA",
 "due_date": null,
 "detail_url": "https://www.publicnoticepa.com/
 Details.aspx?SID=2435381",
 "description_full": "Title: FOR BIDS (IFB) ACHA-1729 ?
 Tree Trimming and Removal Services The Allegheny
 Buyer: Removal Services The Allegheny County
 State: PA
 Closes: None
 Source URL: https://www.publicnoticepa.com/
 Details.aspx?SID=2435381

 RFP body:
 49707/26/2026https://www.post-gazette.com/
 PublicNoticesALLEGHENY COUNTY HOUSING AUTHORITY
 INVITATION FOR BIDS (IFB) ACHA-1729 ? Tree
 Trimming and Removal Services…"
}`],notes:["Note what did not travel: the clean title Pass 1 wrote. This file is rebuilt from the snapshot, so the judge gets the mangled version again."],tables:[]}],notes:[],then:"seven notices are scored out of 100"},{n:"8",title:"Pass 2: would LGS bid this?",who:"max-bid-judge · AI, then the child agent writes the file",summary:["Each open notice gets a score out of 100, a yes, maybe or no, a reason, and two lists of signals. Tonight: 1 yes, 3 maybe, 3 no. All three NOs are the same school-district grass-cutting notice, printed three times under three different ids, and the judge said so in each one.","Every row is flagged out_of_core_state because Pennsylvania sits outside the eight states LGS works in. That flag is written by the AI following a written instruction. No code checks it."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"7 rows"},{path:"runs/judge-verdicts.json",size:"12,408 bytes · 7 rows"}],blocks:[`2435381 yes 80 Tree Trimming and Removal, ACHA
2435961 maybe 48 FEMA HMGP Acquisition, Skippack Twp
2434023 maybe 47 Condemned Property, Black Creek Twp
2433996 maybe 45 Advertisement for Bids, Leetsdale Boro
2435623 no 20 Grass Cutting, Chartiers Valley SD
2435566 no 20 Grass Cutting, Chartiers Valley SD
2435550 no 20 Grass Cutting, Chartiers Valley SD`],notes:["Two verdict shapes in one file. Every row here carries both the current keys and the retired ones: would_lgs_bid and verdict, score and lgs_score, primary_reason and reasoning. This is the exact shape that caused a silent loss of YES bids in July. It does no harm today because the compile step and the board dumper both read either shape. The twin portal's runbook bans the old keys. This one's does not."],tables:[]},{label:"Real record Notice B · YES, 80",paths:[],blocks:[`{
 "bid_id": "2435381",
 "title": "Tree Trimming and Removal Services
 (IFB ACHA-1729) - Allegheny County Housing
 Authority",
 "buyer": "Allegheny County Housing Authority",
 "would_lgs_bid": "yes",
 "score": 80,
 "primary_reason": "Verbatim core work: ACHA “invites
 sealed bids from qualified firms to provide Tree
 Trimming and Removal Services at v[arious]” sites
 - Category 4 county tree maintenance with a multi-
 site scope, not a one-building job… Value unstated
 and body cut off - pull the IFB packet for the
 site count before pricing.",
 "service_match": "core",
 "scale_match": "unknown",
 "buyer_match": "strong",
 "red_flags": [
 "thin_description",
 "out_of_core_state",
 "value_unstated_pull_ifb_packet",
 "no_due_date_in_notice_body"
 ],
 "fit_signals": [
 "verbatim_tree_trimming_and_removal_services",
 "countywide_institutional_portfolio_multi_site",
 "formal_ifb_sealed_bid_acha_1729",
 "qualified_firms_prequalification_language"
 ],
 "due_date_believed": null,
 "due_date_conflict": null,
 "verdict": "yes",
 "lgs_score": 80,
 "reasoning": "…the same sentence as
 primary_reason, word for word…",
 "out_of_core_state": true,
 "kansas_city_risk": false,
 "closed_award": false
}`],notes:['The judge fixed the buyer too. The snapshot said "Removal Services The Allegheny County". The verdict says "Allegheny County Housing Authority", which is what the notice text actually says.'],tables:[]}],notes:[],then:"tonight's answers are merged with the old ones and written down"},{n:"9",title:"Write the day's folder",who:"ps.compile_archive",summary:["Carried and new Pass 1 rows become one set of 145. Yesterday's verdicts for notices still in tonight's snapshot are merged with tonight's 7, giving 34. Then the day's folder is written, plus a report and a row in the running index.","This merge is the whole memory of the portal. Without it, tonight's archive would show 7 verdicts instead of 34 and the board would forget every bid judged on an earlier day."],cells:[{label:"Out · data/publicnotice-pa/daily/2026-07-28/",paths:[],blocks:[],notes:["A dropped notice loses its verdict from today. Carried verdicts are kept only for notices still in tonight's snapshot. Because of the fifty cap at stage 3, a notice pushed out of the newest fifty for its phrase quietly leaves today's archive. Older archives still hold it, so the running ledger and the board card survive."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","145 rows, the whole snapshot","118,232 B"]},{header:!1,cells:["triage.json","145 decisions, tomorrow's memory","20,993 B"]},{header:!1,cells:["verdicts.json","34 scored notices, merged","35,731 B"]},{header:!1,cells:["stats.json","the funnel counts","463 B"]},{header:!1,cells:["report.md","human summary, rewritten at 2.7","7,605 B"]}]]},{label:"Real record Notice B in the archive",paths:[],blocks:[`{
 "bid_id": "2435381",
 "title": "Tree Trimming and Removal Services
 (IFB ACHA-1729) - Allegheny County Housing
 Authority",
 "buyer": "Allegheny County Housing Authority",
 "would_lgs_bid": "yes",
 "score": 80,
 "verdict": "yes",
 "lgs_score": 80,
 "out_of_core_state": true,
 "bid_key": "publicnotice-pa:2435381"
}`,`{
 "idx": 0,
 "bid_id": "2402387",
 "would_lgs_bid": "yes",
 "score": 82,
 "title": "Emergency Tree & Limb Removal — City of Erie",
 "reasoning": "Emergency tree & limb removal, City of
 Erie — Cat 4 annual city contract.",
 "red_flags": [
 "out_of_core_state",
 "thin_description_pull_rfp_packet"
 ],
 "_first_judged": "2026-06-23"
}`],notes:["Shortened to the keys the compile step touches. bid_key is added here and exists nowhere upstream.","Judged five weeks earlier. It cost this run nothing and still counts in tonight's 9 YES. 13 of the 34 archived verdicts carry that same _first_judged date."],tables:[]}],notes:[],then:"one thing that can destroy this folder, and never has"},{n:"10",title:"The QA gate can overwrite a real day",who:"off-pipeline · python scripts/portal_qa.py --slug publicnotice-pa",summary:["This is not part of the nightly run. An operator runs it by hand to prove the sweep is repeatable. To do that it fakes a Pass 1 in which every new notice is SKIP, blanks Pass 2, compiles that into today's folder, and re-runs to check nothing new appears.","The damage would be permanent for those notices. Tomorrow's run reads today's folder as its memory, so the faked SKIPs would carry forward and those notices would never be scored. Verdicts already earned are safe. Only Pass 1 is destroyed."],cells:[{label:"Checked on disk",paths:[],blocks:[`$ grep -rl "qa-baseline" data/publicnotice-pa/
(no matches)`],notes:[`Clean on record. No archived day for this portal carries the marker. The mechanism is live but has never fired here. One thing worth correcting: two comments in the repo call this "the --stage full clobber". It is not gated on the stage. It is gated on the pull's exit code, so the plain default run does exactly the same thing.`],tables:[]}],notes:[],then:"the portal's own night is over; the shared machinery takes over"},{n:"11",title:"Carry forward: skipped on purpose",who:"2.5 · python scripts/carry_forward_verdicts.py --all",summary:[`The shared safety net rescues verdicts for bids that fell out of a portal's pull. It only runs on portals whose registry entry says carry_forward: "orchestrator". This portal says "engine-internal", so the --all run does not touch it.`,"In plain words: this portal already does its own carrying, twice, inside the sweep. Pass 1 decisions are carried at stage 4 and Pass 2 verdicts at stage 9. Running the shared pass as well would apply the same merge a second time."],cells:[{label:"Real record · two audit files DO exist, from June",paths:[],blocks:[`{
 "portal": "publicnotice-pa",
 "today": "2026-06-23",
 "prior_date_used": "2026-06-22",
 "today_new_judged": 29,
 "carried_forward": 0,
 "carried_forward_not_in_today_snapshot": 0,
 "dropped_too_old": 0,
 "dropped_already_judged_today": 29,
 "dropped_closed_award": 0,
 "final_total": 29,
 "final_yes": 13,
 "final_maybe": 9,
 "final_no": 4,
 "max_age_days": 90
}`],notes:['The written map is wrong here, and the files win. It states that no _carryforward_audit.json exists for this portal. Two do: daily/2026-06-09/ and daily/2026-06-23/. Both were written by the shared pass being pointed at this portal by hand. Both did nothing, because every verdict was already judged that same day: carried_forward: 0 on both. So the rule held in effect, but the claim "it has never run here" is not true. No such file exists for 28 July.'],tables:[]}],notes:[],then:"the ledger, the report and the board fixture are rebuilt"},{n:"12",title:"Ledger, report, board cards",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps. The ledger walks all 33 archived days and keeps every YES and MAYBE this portal has ever produced. The report writer rewrites today's report.md so it matches every other portal. The fixture dumper turns YES verdicts into cards for the board.","The dumper is a gate: it keeps YES only. This portal's 19 MAYBE notices show up in the ledger and in the day's own report, but never as a card on the board."],cells:[{label:"What each step holds for this portal",paths:[],blocks:[],notes:["22 YES in the ledger, 13 on the board. That gap is the gate working. All nine missing notices have a closing date earlier than the first day we saw them, and all nine were first seen on 2026-06-07, the day the portal was switched on. They were already closed when we found them. Example from the ledger: 2384449, first seen 2026-06-07, closes 2026-05-21. The board is a live board, so it drops them on purpose. Nothing leaked."],tables:[[{header:!0,cells:["Step","This portal's share"]},{header:!1,cells:["2.6 cumulative ledger","41 rows: 22 YES, 19 MAYBE. 16 still open, 25 closed."]},{header:!1,cells:["2.7 standardized report","7,605 bytes, 9 YES and 9 MAYBE listed, regenerated 22:37 UTC"]},{header:!1,cells:["2.8 board fixture","13 cards of 1,470 total; 0 MAYBE cards"]}]]},{label:"Real card Notice B on the board",paths:[],blocks:[`{
 "id": "3b0fb1efa11588df",
 "portal": "publicnotice-pa",
 "source_bid_id": "2435381",
 "title": "Tree Trimming and Removal Services
 (IFB ACHA-1729) - Allegheny County Housing
 Authority",
 "buyer": "Allegheny County Housing Authority",
 "state": "PA",
 "solicitation_no": null,
 "federal": false,
 "score": 80,
 "verdict": "yes",
 "due_date": "",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "red_flags": [
 "thin_description", "out_of_core_state",
 "value_unstated_pull_ifb_packet",
 "no_due_date_in_notice_body"
 ],
 "fit_signals": [],
 "first_seen": "2026-07-28",
 "last_seen": "2026-07-28",
 "has_documents": false
}`],notes:["Three things went missing on the way. The four fit signals are gone, the reason text is cut off mid-word at 400 characters, and the closing date is an empty string because the newspaper notice never printed one."],tables:[]}],notes:[],then:"the cards stop being one portal's rows and join the shared board"},{n:"13",title:"Publish, cluster, dedup",who:"2.85 · publish_to_supabase.py · llm_dedup_candidates.py · bid-dedup-judge · apply_llm_dedup.py",summary:["The 13 cards are written into the shared bids table, then grouped with every other portal's bids so one solicitation seen in two places becomes one row. Grouping keys off the buyer name, which is this portal's weakest field.","This portal is marked as a reprinter, so when it shares a group with a portal that got the bid straight from the agency, the other portal's buyer name wins. Pennsylvania has no second feed in the roster, so most of these groups have only this portal in them and there is nothing better to fall back to."],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:"13 cards for this portal"},{path:"Supabase portals, bids, clusters, sweep_runs",size:null},{path:"data/portals/llm-dedup-candidates.json",size:"pairs to judge"},{path:"data/portals/llm-dedup-merges.json",size:"17 merges"}],blocks:[],notes:['The same notice, printed twice, is two bids to us. Notice B is the second printing of a notice we already had as 2431268, judged on 20 July at score 82. Both are on the board as separate cards with different buyer strings: "Removal Services The Allegheny County" and "Allegheny County Housing Authority". Four more pairs like it sit on the same 13-card board: Erie 2402387/2404546, Franklin Township 2402346/2406798, Lower Merion 2426805/2427925 (scored 70 and 62 for the same job), Douglass Township 2364440/2360965.'],tables:[]},{label:"Real record · the dedup judge caught this one",paths:[],blocks:[`{
 "a": "017dcf19-afa5-42ad-8b30-0b9309cc135f",
 "b": "86f33dd2-395a-43f8-85e8-f4b17beb4656",
 "confidence": "high",
 "reason": "same IFB number ACHA-1729, same
 Allegheny County Housing Authority, two printings
 of the same public notice on publicnotice-pa"
}`,`{
 "desc_snippet": "DOCUMENTS: usalegalnotice.com Public
 Notice Pennsylvania | Pennsylvania NewsMedia
 Association Back Smart Search Sign In About…",
 "source_hosts": ["www.publicnoticepa.com"],
 "portals": ["publicnotice-pa"]
}`],notes:["From data/portals/llm-dedup-merges.json, one of 17 merges. The two printings had landed in two different groups, 017dcf19… and 86f33dd2…, because the buyer strings did not match. They reached the judge as 1 of 120 candidate pairs with a text overlap of 1.0 and were merged with high confidence. So the repeat-printing problem does get caught, but only at the last stage, by an AI reading two rows side by side.","The evidence the judge was handed for one side of that pair is the website's menu bar, because that is all the detail page gives us."],tables:[]}],notes:[],then:"the board tries to fetch documents and pull out requirements"},{n:"14",title:"Documents and requirements: nothing to read",who:"2.85b run_enrichment_phase.py · 2.87 extract_doc_text.py + apply_requirements.py · 2.89 build_bidpack.py",summary:["The document publisher looks at each portal's snapshot for a list of files. These rows have no such field, so the portal is skipped before any network call. Document coverage for this portal is 0%, and the registry already records why: the solicitation files sit behind the newspaper's reader login.",`Requirements extraction is grouped, not per bid. This portal's one group has a bid pack but no documents, and the only text in that pack is the site's menu, so the extractor answered "status": "partial" with every field left null. The pack's own requirements.md still reads "No structured requirements extracted yet". The pipeline does have a proper "nothing to read" label, but it is written out as partial as well, because the deployed board crashes on any status it does not already know.`],cells:[{label:"Real record · this portal's one entry in the requirements manifest",paths:[],blocks:[`{
 "cluster_id": "2f57c3d5-3298-453e-a0e7-e6a10834b661",
 "pack_key": "pa-borough-of-westmont-shade-tree-
 emergency-misc-trimming-annual-borough-of-
 west-103fa7",
 "has_pack": true,
 "portal": "publicnotice-pa",
 "title": "Shade Tree Emergency/Misc Trimming
 (annual) — Borough of Westmont",
 "buyer": "Borough of Westmont",
 "state": "PA",
 "due_date": null,
 "doc_ids": []
}`],notes:["One of 257 groups in the manifest. doc_ids is empty, which is the honest answer."],tables:[]},{label:"What its bid pack actually contains",paths:[],blocks:[`data/bidpacks/pa-borough-of-westmont-…-103fa7/
 BID.md
 notes.md
 outcome.md
 page-publicnotice-pa.md 883 chars of site menu
 requirements.md
 (no docs/ folder)`,`# Requirements

_No structured requirements extracted yet._`],notes:["One real path we never follow. The runbook records that the files for at least one Pennsylvania notice are handed out by an outside bidding service at pha.bonfirehub.com/opportunities/235385. We already run a sweep against that service. Nothing in this portal's flow reads that link out of the notice text and goes to get them."],tables:[]}],notes:[],then:"anything whose evidence just improved gets re-judged"},{n:"15",title:"The second look that never sees anything new",who:"2.875 · post-enrichment dedup re-pass",summary:["After documents and contacts are filled in, dedup runs again on the pairs whose evidence changed. A bid that gained a real buyer name or a real closing date can now be matched to its twin properly.","For this portal the re-pass is a formality. Stage 14 adds nothing to its rows, so its evidence is identical to what stage 13 already saw and no pair is re-judged. Whatever the first dedup pass decided stands."],cells:[{label:"Why nothing changes",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Documents added at 2.87","none. 0% coverage, the wall is a reader login"]},{header:!1,cells:["Buyer improved","no. The buyer is whatever the AI wrote at Pass 2"]},{header:!1,cells:["Closing date improved","no. due_date is re-read from the same snippet"]},{header:!1,cells:["Contacts filled from description text","15% of rows, from the snippet, board-side"]}]]}],notes:[],then:"watch for changes, send the mail, check the run"},{n:"16",title:"Watch, digests, sentinel",who:"2.88 · watch_list_signals.py · new_bids_email.py · pipeline_sentinel.py",summary:["New YES groups go into the discovery email. The watcher looks for changes since last time, and the sentinel checks that every portal swept when it should have and that its capture is not too thin.",'The watcher can find almost nothing here. Status is hardcoded "Open" at pull time and the results table has no revision counter, so the only change it could ever notice is a closing date re-read out of the same snippet. The registry sets watch mode to none.'],cells:[{label:"Real record · this portal's row in data/portals/sentinel.json",paths:[],blocks:[`{
 "slug": "publicnotice-pa",
 "batch": "portals",
 "status": "AMBER",
 "issues": [
 "thin capture: contact 15% docs 0% ->
 /portal-perfect publicnotice-pa"
 ],
 "last_archive": "2026-07-28",
 "surfaced": 13
}`],notes:["Amber, and correctly so. The thin-capture half is a known wall, not a fault: there is no page to read. The sentinel did not flag the portal as stale because it ran on the 28th and the archive is from the 28th. The five-day gap before that never showed up anywhere. Emails stay a silent no-op until the mail key is in place."],tables:[]}],notes:[],then:null}],h=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["Newspapers print the same notice several times, and each printing has its own id","5 duplicate pairs among the 13 board cards. The same Lower Merion job is on the board twice at 70 and at 62; the same Allegheny job at 82 and at 80. The dedup judge caught the Allegheny pair with high confidence, so the machinery works, but it works at the very last stage"]},{header:!1,cells:["The buyer is guessed from the snippet, and the fallback is the newspaper's own name","39 of 145 rows name a newspaper as the buying agency. That string is what the shared board groups on. This portal is marked a reprinter so a direct portal's name wins, but Pennsylvania has no second feed, so most groups are single-source with nothing better to fall back to"]},{header:!1,cells:["There is no detail page we can read",'The 300-character search snippet is the description, forever. Asking for the notice page directly returns the site menu and "You must complete the challenge in order to continue". 883 characters of it are saved in a bid pack today']},{header:!1,cells:["Fifty results per phrase, one page per phrase",'"land clearing" returned exactly 50 on this run and on 40 of the 41 runs in the log. Anything older than the newest fifty for that phrase has never been seen and never will be. At the other extreme "storm debris" has returned nothing on every run recorded']},{header:!1,cells:["Titles are derived by pattern matching, then rewritten by the AI",`"North Street" became "Ordinance Adoption Notice - Borough of Berlin Council". The board title is written by a language model, not read from the page. The judge's input file is rebuilt from the snapshot, so the AI's clean title does not travel to Pass 2`]},{header:!1,cells:["The newspaper's page furniture is glued into the notice body",'Bodies start with strings like 49707/26/2026https://www.post-gazette.com/PublicNotices, and a dash the scraper could not read shows as ?. The judge noticed and wrote that some keyword hits "likely matched sibling notices on same page"']},{header:!1,cells:['Status is hardcoded "Open" at pull time',"145 of 145 rows say Open. We never learn a solicitation has closed. The board's closing date for the new YES is an empty string, because the notice never printed one"]},{header:!1,cells:["Two verdict shapes in one file","score and lgs_score, verdict and would_lgs_bid, primary_reason and reasoning. Harmless today because compile and the board dumper read either. This is the shape that silently lost YES bids on 20 July. The twin portal's runbook bans the old keys; this one's does not"]},{header:!1,cells:["MAYBE never reaches the board","The board dumper keeps YES only. 19 MAYBE notices live in the running ledger and in the daily reports, but no operator sees them as a card. Tonight three of them were new, including a FEMA buyout at 48 and a borough notice at 45 the judge deliberately surfaced rather than kill on a cut-off sentence"]},{header:!1,cells:["The QA gate can overwrite a real day with all-SKIP rows","Because this portal carries its own decisions forward, faked SKIPs would compound run after run. No archived day carries the marker, so nothing is damaged. But it is gated on the pull's exit code, not on the stage flag, and two repo comments say otherwise"]},{header:!1,cells:["_keywords is written on every row and read by nothing","Dead weight in the snapshot and in every archived day. The only readers in the repo are BidNet scripts"]},{header:!1,cells:["The portal is missing from the monitor's state map","The tracking board shows a blank state and non-core for this portal. Non-core is right for Pennsylvania, but by accident. The overview page gets it right because it reads the config file instead"]},{header:!1,cells:["The runbook is still an auto-generated draft, and the recon folder is empty","Every field-map row in data/publicnotice-pa/PORTAL.md says TODO, and /portal-audit publicnotice-pa has never been run. data/publicnotice-pa/recon/ exists and holds nothing"]},{header:!1,cells:["22 YES in the ledger, 13 on the board","Not a leak. All nine absentees closed before the day we first saw them, all first seen on 2026-06-07 when the portal was switched on. The live-board gate drops them on purpose. Example: 2384449, first seen 2026-06-07, closes 2026-05-21"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk. Every count traces to data/publicnotice-pa/daily/2026-07-28/stats.json, a row count, a byte size, or a line in data/publicnotice-pa/logs/pull_log.txt. Baseline map: docs/portal-dataflow/publicnotice-pa.md, which describes the run of 23 July and is one run behind this page. Where the two disagree, this page follows the files."]}],d="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk. Every count traces to data/publicnotice-pa/daily/2026-07-28/stats.json, a row count, a byte size, or a line in data/publicnotice-pa/logs/pull_log.txt. Baseline map: docs/portal-dataflow/publicnotice-pa.md, which describes the run of 23 July and is one run behind this page. Where the two disagree, this page follows the files.",c="docs/portal-dataflow/pedia-publicnotice-pa.html",p={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:o,funnel_note:i,legend:r,stages:l,sections:h,footer:d,source_page:c};export{p as default,a as eyebrow,d as footer,o as funnel,i as funnel_note,s as headline,n as lede,r as legend,h as sections,e as slug,c as source_page,l as stages,t as title};
