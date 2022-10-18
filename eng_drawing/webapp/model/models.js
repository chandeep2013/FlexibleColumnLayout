sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel) {
    "use strict";

    return {

        createLocalModel: function () {
            var projectData = {
                "HTMLContent": "<div style='background-color: white;padding:2px'> " +
                    "<div>" +
                    "<h3></h3>" +
                    "<h3 style='color:black; text-align: center;'>TERMS AND CONDITIONS</h3>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>THESE TERMS AND CONDITIONS </strong> (these <strong>Terms</strong> or this  <strong>Agreement</strong>) are by and between the person or entity who is seeking a license to use the MHI RJ Aviation aircraft data (hereinafter, called “Licensee”) and MHI RJ Aviation ULC, or or affiliates, as applicable (hereinafter called, <strong>MHI RJ Aviation</strong>). The terms and conditions set forth herein apply to the granting of a right to use the MHI RJ Aviation aircraft data and associated iflybombardier.com technical documents (including without limitation any MHI RJ Aviation standards) available through the engineering drawings online subscription service via the iflybombardier.com Licensee portal (<strong>Data</strong>)." +
                    "</p>" +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>License</strong>. Subject to the terms and conditions of this Agreement, and until this Agreement is otherwise terminated, MHI RJ Aviation grants Licensee a non-exclusive, personal, non-transferable license (<strong>License</strong>) to use the Data as reference material solely for the maintenance and operation of Licensee’s MHI RJ Aviation CRJ Series, as it applies to the case herein (<strong>Aircraft</strong>), solely for Licensee’s own use (<strong> Purpose</strong>). Licensee has no right to design, produce, modify or manufacture part(s), in whole or in part, from the Data. Licensee shall not to use the Data for any modification, improvement, alteration or engineering modification on the Aircraft. Licensee shall not to use the Data as a substitute for or to reduce the recommended and prescribed maintenance schedules. Licensee shall not use the Data for the purpose of maintaining or prolonging the continuing airworthiness of the aircraft beyond the standard airworthiness limitations as prescribed by MHI RJ Aviation or by the applicable regulatory and/or governmental authorities. Licensee shall not to use the Data in whole or in part, for the support and/or development of any supplemental type certification, or equivalent. Any use of the Data must at all times conform to and apply with the regulations of the applicable regulatory and/or government authorities." +
                    "</p>" +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify;font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>ACCESS</strong>. MHI RJ Aviation will grant Licensee access to the Data electronically via the iflybombardier.com Licensee portal as mutually agreed to by Licensee and MHI RJ Aviation (the <strong>Effective Date</strong>). In order to access the Data, Licensee will be required to meet connectivity and security requirements specified by MHI RJ Aviation. Licensee will be responsible for obtaining its own viewer at its own expense. Only Users of Licensee as identified by Licensee to MHI RJ Aviation and accepted by MHI RJ Aviation shall have access to the Data via the iflybombardier.com Licensee portal." +
                    "</p>" +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify;font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>LICENSE FEE, TAXES, PAYMENT.</strong> For this License, Licensee will pay MHI RJ Aviation in advance (i) a first year initial sign-up fee (Initial Fee), if applicable, and (ii) an annual license fee (<strong>Annual Fee</strong>), (collectively the <strong>Fee(s)</strong>). The amount of the non-refundable Annual Fee and Initial Fee is published on the iflybombardier.com Licensee portal. The Fees may be subject to change by MHI RJ Aviation without notice on an annual basis, and any change in Fees shall be effective as of the Effective Date or as of each anniversary of the Effective Date, as applicable." +
                    "</p>" +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify;font-size: 1rem; font-family: sans-serif;'>Fees are due within thirty (30) days of the date of MHI RJ Aviation’s invoice. Licensee shall make payments in immediately available funds by deposit, certified funds or wire transfer to the account of MHI RJ Aviation ULC or any of its affiliates as directed by MHI RJ Aviation. Each payment shall reference the invoice number and “MHI RJ Aviation Online Drawing Service”.</p>" +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify;font-size: 1rem; font-family: sans-serif;'>The Fee does not include any taxes (except for the Canadian corporate income taxes of MHI RJ Aviation), fees or duties including, but not limited to sales, use, withholding, value added, goods and services taxes, personal property, gross receipts, franchise, excise taxes, assessments or duties, (<strong> Taxes</strong> ), which are or may be levied, assessed or imposed by law upon MHI RJ Aviation or any affiliate of MHI RJ Aviation, Licensee or any affiliate of Licensee, whether or not there is an obligation for MHI RJ Aviation to collect same from Licensee, by any taxing authority or jurisdiction occasioned by, relating to or as a result of the License, the access or use of the Data or any other matter related to this Agreement. Any Taxes, together with any penalties, fines or interest thereon, shall be paid by Licensee. MHI RJ Aviation shall invoice and collect from Licensee, and Licensee shall pay, any Canadian goods and services taxes and other similar taxes, if any, assessed or imposed pursuant to this Agreement and MHI RJ Aviation shall remit such taxes to the appropriate tax authorities. If a claim is made against MHI RJ Aviation for any Taxes, together with any penalties, fines or interest thereon, MHI RJ Aviation shall promptly notify Licensee and, as directed by MHI RJ Aviation at MHI RJ Aviation’s sole and absolute discretion, Licensee shall pay such Taxes and claim directly to the taxing authority, together with any penalties, fines or interest, within ten (10) days. </p>" +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify;font-size: 1rem; font-family: sans-serif;'>Licensee shall make all payments hereunder without set-off, deduction or counterclaim of any kind. If Licensee is otherwise obliged by law to make any deduction or withholding from any payment required to be made by Licensee with respect to any taxes, the amount due from Licensee in respect of such payment shall be increased to the extent necessary to ensure that, after the making of such deduction or withholding, MHI RJ Aviation receives a net amount equal to the amount MHI RJ Aviation would have received had no such deduction or withholding been required to be made. Should Licensee fail to make a payment when it becomes due and payable hereunder, Licensee shall pay MHI RJ Aviation daily administrative charges on the outstanding amount at a rate of one point seventy-five percent (1.75%) per month based on the rate of twenty-one percent (21%) per annum, calculated monthly. Charges will accrue to the date payment is received by MHI RJ Aviation.</p>" +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>CONFIDENTIALITY AND PROPRIETARY.</strong> Licensee agrees that the Data (i) is confidential and proprietary to MHI RJ Aviation, (ii) will be used by Licensee solely for the Purpose as described above, (iii) will not be reproduced, disclosed, used or transferred to any person or third party without MHI RJ Aviation’s prior written consent and (iv) remains the property of MHI RJ Aviation at all times, whether or not protected by patent, copyright, trademark, industrial design, trade secret, know-how or otherwise." +
                    "</p>" +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>In no event will any of the Data be disclosed or used for any other purpose, other than the Purpose, including without limitations the following:</p>" +
                    "<ol style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<li>for the purpose of designing, modifying, reverse-engineering, manufacturing or selling components, parts or spare parts for an aircraft; nor</li>" +
                    "<li>to disclose, directly or indirectly, the Data, in part or in whole, to any third party which supports or manufactures any aircraft or aircraft parts in competition with MHI RJ Aviation; nor</li>" +
                    "<li>for the purpose of designing, manufacturing, repairing, or modifying of an aircraft, or for the substantiation and/or support thereof; nor</li>" +
                    "<li>to reproduce, duplicate, copy, sell, translate or exploit the Data, in part or in whole, for any commercial purposes, including without limitation, the use of the Data, or access to the Data;</li>" +
                    "<li>to incorporate into copies, derivations, analyses, compilations, studies, reports, memoranda, notes or other materials containing, or based upon, in whole or in part on, the Data.</li>" +
                    "</ol>" +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>Such Data shall only include MHI RJ Aviation data which currently exists and is proprietary to MHI RJ Aviation. The MHI RJ Aviation online drawings only include mechanical (installation and assembly), electrical and avionics drawings, as currently existing on the engineering drawings online subscription service via the iflybombardier.com Licensee portal, and shall exclude any ground support equipment, drawings and data proprietary to vendors and third parties suppliers.</p>" +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>Licensee will only disclose or permit access to the Data via the iflybombardier.com Licensee portal to employees having a need to know for the performance of work pursuant to this Agreement (<strong> Users</strong > ), and Licensee shall ensure that such employees do not make unauthorized disclosures. Only Users will be allowed access to the Data via the iflybombardier.com Licensee portal. All changes in status of any Users must be reported immediately to MHI RJ Aviation, and Licensee or MHI RJ Aviation, upon receipt of written notice from Licensee regarding change of status, shall terminate access of such Users to the Data via the iflybombardier.com Licensee portal. Licensee shall be responsible for any failure to notify MHI RJ Aviation of any change of status of Users. Licensee shall be responsible for all unauthorized disclosure or use of Data by Users after change in status of such Users.</p>" +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>The confidentiality and proprietary obligations contained herein shall be continuing obligations and Licensee shall not be relieved therefrom, be it by expiration or termination of this Agreement or otherwise, unless MHI RJ Aviation so agrees in writing.</p>" +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>EXCUSABLE DELAY.</strong> In the event MHI RJ Aviation is delayed in the performance of its obligations or responsibility under an Order due directly or indirectly to a cause which is beyond MHI RJ Aviation’s reasonable control or without MHI RJ Aviation’s fault or negligence (an “Excusable Delay”), MHI RJ Aviation shall not be liable for, nor shall MHI RJ Aviation be deemed to be in default under the respective Order or these Terms on account of such delay in access of the material or other performance hereunder and the time fixed or required for the performance of any obligations or responsibility in the Order or these Terms shall be extended for a period equal to the period during which any such cause or the effect thereof persists.  Excusable Delay shall be deemed to include, without limitation, delays occasioned by the following causes:</p>" +
                    "<ol style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<li>force majeure or acts of God;</li>" +
                    "<li>act of war, civil commotion, insurrection, terrorism, riot or embargo;</li>" +
                    "<li>fire, explosion, earthquake, lightning, flood, draught, windstorm, epidemic, pandemic or quarantine or other action of the elements or other catastrophic or serious accidents;</li>" +
                    "<li>any legislation, act, order, directive or regulation of any governmental or other duly constituted authority;</li>" +
                    "<li>strikes, lockout, walkout, or other labour troubles causing cessation, slow-down or interruption of work;</li>" +
                    "<li>any delay or interruption in access to and from the MHI RJ Aviation Licensee website portal that would give Licensee access to the Data;</li>" +
                    "<li>general lack or shortage or delay of supplies, materials, accessories, equipment, tools or parts;</li>" +
                    "<li>delay or failure of carriers, subcontractors, or suppliers for any reason whatsoever; or</li>" +
                    "<li>any delay or interruption in a computer system that would give Licensee access to the Data;</li>" +
                    "<li>delay in obtaining any airworthiness approval, export control permit, certificate, approval or license, for any equivalent approval certification, by reason of any law or governmental order, directive or regulation or any change thereto or interpretation thereof, by a governmental authority;</li>" +
                    "<li>any act of the Licensee; or</li>" +
                    "<li>any other cause whatsoever, whether similar to those mentioned above or of a different nature beyond MHI RJ Aviation’s reasonable control.</li>" +
                    "</ol> " +
                    "</div>" +
                    "<div>" +
                    "<h3></h3>" + "<h3 style='color:black;'>SPECIAL CONDITIONS.</h3>" +
                    "<ol style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<li>Licensee hereby acknowledges and agrees that it shall not, and has no right to amend, modify, reverse engineer, de-compile, translate,  disassemble or derive the Data in any manner whatsoever and that to do so would constitute a default under this Agreement.</li>" +
                    "<li>Licensee agrees that the MHI RJ Aviation engineering or certification basis of the Data shall not be the engineering or certification basis for the Licensee’s engineering or certification basis. Licensee may only use the Data as a reference in support of Licensee’s stand-alone engineering efforts and the Data shall not be used to substantiate the engineering efforts of Licensee. Any of Licensee’s engineering or technical documents, shall not include any MHI RJ Aviation or Canadair document references or drawing representations, including any MHI RJ Aviation or Canadair trademarks, as supporting documentation for such certification efforts.</li>" +
                    "<li>The performance of MHI RJ Aviation’s obligations contained in this Agreement shall be subject to and apply only to the extent permitted by applicable laws, regulations, directives and/or orders regarding export controls, including those of Canada, the United States of America and any other country. In particular, Licensee shall in no event disclose any Data for use in, or use or permit its use in, or directly or indirectly ship, export or re-export any Data to or for use in any country or area to which, under the laws and regulations of Canada, the United States of America or any other country, MHI RJ Aviation could not itself export or re-export such Data.</li>" +
                    "<li>. In the event of a violation of this Agreement, MHI RJ Aviation shall be entitled, in addition to any other rights or remedies which it may have at law or in equity, to specific performance or injunctive relief. Licensee agrees that in such event, MHI RJ Aviation will be substantially and irreparably harmed, damages are impossible to ascertain in advance, and monetary damages will not sufficiently compensate MHI RJ Aviation.</li>" +
                    "</ol> " +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>TERMINATION.</strong> Upon failure by Licensee to observe any or all of the terms and conditions of this Agreement, and/or the iflybombardier.com user policy, and/or Licensee permits unauthorized access to or use of the Data, fails to notify MHI RJ Aviation of any change of status of Users, including without limitation the unauthorized sharing or disclosure of any access password, and/or or if an Event of Default, (as defined below) occurs, MHI RJ Aviation shall have the right, but not the obligation, at its own discretion, to immediately suspend or to terminate, in whole or in part, without notice, access to the Data via iflybombardier.com and/or terminate, in whole or in part, this Agreement.</p>" +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "Upon such termination, or in any event when the License has expired, the License and Licensee’s access to the Data via the iflybombardier.com Licensee portal shall immediately cease and Licensee shall 1) destroy the Data, including without limitation any of Licensee’s notes, drawings, copies and designs derived from or including the Data, in any media whatsoever, and/or return the Data to MHI RJ Aviation (and certify such destruction or return of the Data in writing) within thirty (30) days of date of termination and 2) pay MHI RJ Aviation any and all monies owing to MHI RJ Aviation under this Agreement.</p>" +
                    "</div>" +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "The occurrence of one or more of the following events shall constitute a default by Licensee under this agreement (“Event of Default”):</p>" +
                    "</div> " +
                    "<div>" +
                    "<ol style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<li>Licensee fails to make any payment when due under this Agreement;</li>" +
                    "<li>Licensee becomes insolvent or bankrupt, or institutes or has instituted against it any proceedings relating to insolvency or bankruptcy, or a receiver and/or manager or person with like powers is appointed to take charge of Licensee’s business, property or assets, or Licensee seeks relief under the provisions of any other existing or future bankruptcy or other similar laws providing for the reorganization of corporations and/or agreement or adjustment with creditors;</li>" +
                    "<li>Licensee suspends or ceases to carry on business or threatens to do so, or disposes of all or substantially all of its assets or threatens to do so, or an order shall be made or a resolution passed for the winding up or liquidation of Licensee;</li>" +
                    "<li>Licensee fails to procure or maintain insurance pursuant to this Agreement or such insurance is cancelled or lapses; or</li>" +
                    "<li>Licensee fails to perform or observe any other obligation, covenant or condition under this Agreement.</li>" +
                    "</ol> " +
                    "</div> " +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>APPLICABLE LAWS AND EXCLUSIVE JURISDICTION.</strong> This Agreement shall be governed by the laws of the Province of Ontario and the laws of Canada applicable therein, and the Parties hereby irrevocably attorn to the courts of the City of Toronto, Province of Ontario which shall have exclusive jurisdiction to determine any disputes arising out of this Agreement.</p>" +
                    "</div> " +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>ASSIGNMENT.</strong> Licensee shall not assign, transfer or dispose of, in whole or in part, any of it rights and obligations under this Agreement or the License to any other person or party without the prior written consent of MHI RJ Aviation, which consent may be withheld at MHI RJ Aviation’s sole discretion. Such assignment, transfer or disposal, includes, without limitation, a merger, acquisition, amalgamation, reorganization or transfer of shares, resulting in a change of control of Licensee.</p>" +
                    "</div> " +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "MHI RJ Aviation may assign or transfer all or any part of its rights and obligations under this Agreement without the prior written consent of Licensee to any affiliate of MHI RJ Aviation or to any corporation succeeding to all or a portion of MHI RJ Aviation's assets, and MHI RJ Aviation may also assign to any party the right to receive money due under this Agreement.</p>" +
                    "</div> " +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>WAIVER, DISCLAIMER AND RELEASE.</strong> MHI RJ Aviation does not make any warranty or guarantee in connection with the Data or its use and Licensee waives, releases and renounces all warranties, conditions, obligations and liabilities of MHI RJ Aviation, and all rights, claims and remedies Licensee may have against MHI RJ Aviation, express or implied, arising by law or otherwise, with respect to any defect in the Data, including without limitation:</p>" +
                    "<ol style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<li>any implied representation, warranty or condition of merchantability or fitness for a particular purpose;</li>" +
                    "<li>any implied representation, warranty or condition arising from course of performance, course of dealing or usage of trade; and</li>" +
                    "<li>any obligation, liability, right, claim or remedy in tort, whether or not arising from the active, passive or imputed negligence of MHI RJ Aviation.</li>" +
                    "</ol> " +
                    "</div> " +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>RELEASE AND INDEMNIFICATION.</strong> Licensee releases and agrees to defend, indemnify and hold harmless MHI RJ Aviation ULC, its other divisions, subsidiaries and affiliates, its officers, directors, agents, representatives and employees (the <strong>Indemnified Parties</strong>) from and against any and all liabilities, claims, damages, losses and judgments, including related costs and expenses, that may be suffered by, accrued against, be charged to, or recoverable from, the Indemnified Parties or any of them by reason of bodily injury to or death of any person or persons, or loss of, damage to, or loss of use of, any property including any aircraft, as a result of the use of the Data.This release and agreement to defend, indemnify and hold harmless applies to claims by Licensee or third parties, no matter when these claims may be asserted, and regardless of fault or theory of action, whether in contract, tort(including but not limited to the active, passive or imputed negligence of MHI RJ Aviation), or otherwise.</p > " +
                    "</div> " +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>EXCLUSION OF LIABILITIES.</strong> MHI RJ Aviation has no obligation or liability to Licensee (at law or in equity) in contract (including warranty), in tort (whether or not arising from the active, passive or imputed negligence) or otherwise, including without limitation any:</p>" +
                    "<ol style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<li>damages related to loss of revenue, loss of profit, loss of expected savings, business interruption or any other economic losses, or</li>" +
                    "<li>indirect, incidental, consequential, special, or punitive damages, or</li>" +
                    "<li>direct damages</li>" +
                    "</ol> " +
                    "</div> " +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "for any reason whatsoever, including, 1) any defect, error or discrepancy in the Data, 2) any delay or interruption in accessing the Data for any reason whatsoever, 3) the use of the Data, 4) any delay or interruption in the iflybombardier.com Licensee portal that would give Licensee access to the Data, 5) any inaccuracy, insufficiency, or unsuitability for use of the Data, 6) any defect in the quality or quantity of any service or product using the Data or any drawings, tools and technical information furnished by MHI RJ Aviation as part of this Agreement, 7) any failure of the Data to meet Licensee’s requirements, 8) any infringement of any patents, copyright or any other intellectual property rights of third parties, or 9) any failure to perform any of its other obligations under this Agreement.  </p>" +
                    "</div> " +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>INSURANCE.</strong> Without prejudice to its liability to indemnify MHI RJ Aviation under this Agreement, Licensee shall, at its own cost, with insurers with a minimum A.M. Best rating of A- VII (or an equivalent or better rating from another recognized rating agency) effect and maintain aviation liability insurance consistent with industry standards with limits in no event less than Five Hundred Million United States Dollars (US$500,000,000) per occurrence covering Licensee against liability for bodily injury, including death, and damage to property, including any aircraft, arising from the use of the Data. Such policy shall: (i) name the Indemnified Parties as additional insureds, (ii) contain a severability of interest provision, (iii) be primary and without any right of contribution from other collectible insurance. Should Licensee’s insurance policy provide a limit of liability in excess of such amounts, MHI RJ Aviation shall have the right of the benefit to the full extent of the coverage available.</p>" +
                    "</div> " +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "Licensee will provide evidence of this liability insurance policy to MHI RJ Aviation by way of a certificate of insurance on signature of this Agreement and again at each policy renewal date during the Term of this Agreement. The insurance obligations set forth shall be continuing obligations, and Licensee shall not be relieved therefrom, (be it by expiration or termination of this Agreement or otherwise), unless and until MHI RJ Aviation so agrees in writing.</p>" +
                    "</div> " +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>TRADEMARKS.</strong> Licensee shall not, without the prior written consent of MHI RJ Aviation, (which shall be at MHI RJ Aviation's sole discretion), use any trade name or trademarks of MHI RJ Aviation, including without limitation, the words or expressions 'MHI RJ Aviation', 'Canadair Regional Jet', 'CRJ', 'CRJ100', 'CRJ200', 'CRJ700', 'CRJ900', 'CRJ1000', 'Atmosphère' or 'NEXTGEN', other than those which may be used in order to identify the Data. All requests for permission to use any of MHI RJ Aviation's trade name or trademarks, not otherwise authorized herein, shall be accompanied with the proposed text or document in which Licensee wants to use same.</p>" +
                    "</div> " +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "<strong>NOTICES.</strong> Any notice, request, requirement, approval, permission, consent or other communication (Notice) to be given or required under this Agreement shall be provided in writing by either courier, certified mail return receipt requested or other electronic means of communication addressed as set forth below. In the case of other electronic means of communication, notice will be deemed to be received on the date on which it is transmitted.  In the case of certified mail return receipt requested or courier, notice will be deemed to be received when delivered.</p>" +
                    "</div> " +
                    "<div>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>" +
                    "Notices to MHI RJ Aviation shall be addressed to:</p>" +
                    "<p></p>" +
                    "<p style='text-align: justify; font-size: 1rem; font-family: sans-serif;'>MHI RJ Aviation ULC<br>" +
                    "123 Garratt Boulevard, N17-27<br>" +
                    "Toronto, Ontario, Canada" +
                    "</p>" +
                    "</div> " +
                    "</div> "
            };

            var oModel = new JSONModel(projectData);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        }
    };
});
