function _scteParse(psi)
{
    var offset = 0;
    var tableID = this.convertToHex(psi.data, offset++, 1);
    console.log('SCTE Table ID: ' + tableID);
    if (tableID === 'fc') {
          var sectionSyntax = psi.data[offset] >> 7;
          console.log('SCTE Section Syntax: ' + sectionSyntax);
          var privateIndicator = (psi.data[offset] & 0x40) >> 6;
          console.log('SCTE Private Indicator: ' + privateIndicator);
          var sectionLength = this.intFromBytes(psi.data, offset, 2) & 0x0fff;
          offset += 2;
          console.log('SCTE Section Length: ' + sectionLength);
          var protocolVersion = psi.data[offset++];
          console.log('SCTE Protocol Version: ' + protocolVersion);
          var encryptedPacket = psi.data[offset] >> 7;
          console.log('SCTE Encrhypted Packet: ' + encryptedPacket);
          var encryptionAlgorithm = (psi.data[offset] & 0x7e) >> 1;
          console.log('SCTE Encryption Algorithm: ' + encryptionAlgorithm);
          var ptsAdjustment = this.intFromBytes(psi.data, offset, 5) & 0x01ffffffff;
          offset += 5;
          console.log('SCTE PTS Adjustment: ' + ptsAdjustment);
          var cw_index = psi.data[offset++];
          console.log('SCTE CW Index: ' + cw_index);
          var tier = this.intFromBytes(psi.data, offset++, 2) >> 4;
          //offset += 2;
          console.log('SCTE Tier: ' + tier);
          var spliceCommandLength = this.intFromBytes(psi.data, offset, 2) & 0x0fff;
          offset += 2;
          console.log('SCTE Splice Command Length: ' + spliceCommandLength);
          var spliceCommandType = this.convertToHex(psi.data, offset++, 1);
          console.log('SCTE Splice Command Type: ' + spliceCommandType);
          if (spliceCommandType === '05') {
                var spliceTypeName = 'splice_insert';
                console.log('SCTE Splice Type Name: ' + spliceTypeName);
                var spliceEventID = this.convertToHex(psi.data, offset, 4);
                offset += 4;
                console.log('SCTE Splice Event ID: ' + spliceEventID);
                var spliceEventCancelIndicator = psi.data[offset++] >> 7
                console.log('SCTE Splice Event Cancel Indicator: ' + spliceEventCancelIndicator);
                if (!spliceEventCancelIndicator) {
                      var outOfNetworkIndicator = psi.data[offset] >> 7;
                      console.log('SCTE Out Of Network Indicator: ' + outOfNetworkIndicator);
                      var programSpliceFlag = (psi.data[offset] & 0x40) >> 6;
                      console.log('SCTE Program Splice Flag: ' + programSpliceFlag);
                      var durationFlag = (psi.data[offset] & 0x20) >> 5;
                      console.log('SCTE Duration Flag: ' + durationFlag);
                      var spliceImmediateFlag = (psi.data[offset++] & 0x10) >> 4;
                      console.log('SCTE Splice Immediate Flag: ' + spliceImmediateFlag);
                      if (programSpliceFlag && !spliceImmediateFlag) {
                            var timeSpecified = psi.data[offset] >> 7;
                            console.log('SCTE Time Specified: ' + timeSpecified);
                            if (timeSpecified) {
                                  var ptsTime = this.intFromBytes(psi.data, offset, 5) & 0x01ffffffff;
                                  offset += 5;
                                  console.log('SCTE PTS Time: ' + ptsTime);
                            } else {
                                  offset += 1;
                            }
                      }
                      if (!programSpliceFlag) {
                            var componentCount = psi.data[offset++];
                            console.log('SCTE  Component Count: ' + componentCount);
                            for (var c = 0; c < componentCount; c++) {
                                  var componenetTag = psi.data[offset++];
                                  console.log('SCTE Component Tag: ' + componenetTag);
                                  if (!spliceImmediateFlag) {
                                        var timeSpecified = psi.data[offset] >> 7;
                                        console.log('SCTE Time Specified: ' + timeSpecified);
                                        if (timeSpecified) {
                                              var ptsTime = this.intFromBytes(psi.data, offset, 5) & 0x01ffffffff;
                                              offset += 5;
                                              console.log('SCTE PTS Time: ' + ptsTime);
                                        } else {
                                              offset += 1;
                                        }
                                  }
                            }
                      }
                      if (durationFlag) {
                            var autoReturn = psi.data[offset] >> 7;
                            console.log('SCTE Auto Return: ' + autoReturn);
                            var breakDuration = this.intFromBytes(psi.data, offset, 5) & 0x01ffffffff;
                            offset += 5;
                            console.log('SCTE Break Duration: ' + breakDuration);
                      }
                      var uniqueProgramID = this.intFromBytes(psi.data, offset, 2);
                      offset += 2;
                      console.log('SCTE Unique Program ID: ' + uniqueProgramID);
                      var availNum = psi.data[offset++];
                      console.log('SCTE Avail Num: ' + availNum);
                      var availsExpected = psi.data[offset];
                      console.log('SCTE Avails Expected: ' + availsExpected);
                }
          }
    }
}
