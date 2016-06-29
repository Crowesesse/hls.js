function _parseATF(stream)
{
    offset = 0;
    var discontinuityIndicator = adaptData[offset] >> 7;
    var randomAccessIndicator = (adaptData[offset] & 0x40) >> 6;
    var elementaryStreamPriorityIndicator = (adaptData[offset] & 0x20) >> 5;
    var pcrFlag = (adaptData[offset] & 0x10) >> 4;
    var opcrFlag = (adaptData[offset] & 0x08) >> 3;
    var splicingPointFlag = (adaptData[offset] & 0x04) >> 2;
    var transportPrivateDataFlag = (adaptData[offset] & 0x02) >> 1;
    var adaptationFieldExtFlags = adaptData[offset++] & 0x01;
    if (transportPrivateDataFlag) {
          var ebpTagOffset = offset + (pcrFlag * 6) + (opcrFlag * 6) + (splicingPointFlag * 1) + 1;
          //console.log('EBP Tag Offset: ' + ebpTagOffset);
          var ebpTag = this.convertToHex(adaptData, ebpTagOffset, 1);
          //console.log('EBP Tag: ' + ebpTag);
          if (ebpTag === 'df') {
                console.log('ATF Discontinuity Indicator: ' + discontinuityIndicator);
                console.log('ATF Random Access Indicator: ' + randomAccessIndicator);
                console.log('ATF Elementary Stream Priority Indicator: ' + elementaryStreamPriorityIndicator);
                console.log('ATF PCR Flag: ' + pcrFlag);
                console.log('ATF OPCR Flag: ' + opcrFlag);
                console.log('ATF Splicing Point Flag: ' + splicingPointFlag);
                console.log('ATF Transport Private Data Flag: ' + transportPrivateDataFlag);
                console.log('ATF Adaptation Field Ext Flag: ' + adaptationFieldExtFlags);
                if (pcrFlag) {
                      var pcrBase = this.intFromBytes(adaptData, offset, 5) >> 7;
                      console.log('ATF PCR Base: ' + pcrBase);
                      offset += 4;
                      var pcrRefExt = this.intFromBytes(adaptData, offset, 2) & 0x01ff;
                      console.log('ATF PCR Ref Ext: ' + pcrRefExt);
                      offset += 2;
                }
                if (opcrFlag) {
                      var opcrBase = this.intFromBytes(adaptData, offset, 5) >> 7;
                      console.log('ATF OPCR Base: ' + opcrBase);
                      offset += 4;
                      var opcrRefExt = this.intFromBytes(adaptData, offset, 2) & 0x01ff;
                      console.log('ATF OPCR Ref Ext: ' + opcrRefExt);
                      offset += 2;
                }
                if (splicingPointFlag) {
                      var spliceCountdown = adaptData[offset++];
                      console.log('ATF Splice Countdown: ' + spliceCountdown);
                }
                if (transportPrivateDataFlag) {
                      var privateDataLength = adaptData[offset++];
                      console.log('ATF Private Data Length: ' + privateDataLength);
                      var dataParsed = 0;
                      while ((privateDataLength - dataParsed) !== 0) {
                            var dataTag = this.convertToHex(adaptData, offset++, 1);
                            console.log('ATF Transport Private Data Tag: ' + dataTag);
                            var dataLength = adaptData[offset++];
                            console.log('ATF Transport Private Data Length: ' + dataLength);
                            if (dataTag === 'df') {
                                  var formatIdentifier = this.readUTF(adaptData, offset, 4);
                                  console.log('ATF Transport Private Format Identifier: ' + formatIdentifier);
                                  offset += 4;
                                  if (formatIdentifier === 'EBP0') {
                                        var ebpFragmentFlag = adaptData[offset] >> 7;
                                        console.log('ATF EBP Fragment Flag: ' + ebpFragmentFlag);
                                        var ebpSegmentFlag = (adaptData[offset] & 0x40) >> 6;
                                        console.log('ATF EBP Segment Flag: ' + ebpSegmentFlag);
                                        var ebpSapFlag = (adaptData[offset] & 0x20) >> 5;
                                        console.log('ATF EBP SAP Flag: ' + ebpSapFlag);
                                        var ebpGroupingFlag = (adaptData[offset] & 0x10) >> 4;
                                        console.log('ATF EBP Grouping Flag: ' + ebpGroupingFlag);
                                        var ebpTimeFlag = (adaptData[offset] & 0x08) >> 3;
                                        console.log('ATF EBP Time Flag: ' + ebpTimeFlag);
                                        var ebpConcealmentFlag = (adaptData[offset] & 0x04) >> 2;
                                        console.log('ATF EBP Concealment Flag: ' + ebpConcealmentFlag);
                                        var ebpExtFlag = adaptData[offset++] & 0x01;
                                        console.log('ATF EBP Ext Flag: ' + ebpExtFlag);
                                        if (ebpExtFlag) {
                                              var ebpExtPartitionFlag = adaptData[offset++] >> 7;
                                              console.log('ATF EBP Ext Partition Flag: ' + ebpExtPartitionFlag);
                                        }
                                        if (ebpSapFlag) {
                                              var ebpSapType = adaptData[offset++] >> 5;
                                              console.log('ATF EBP SAP Type: ' + ebpSapType);
                                        }
                                        if (ebpGroupingFlag) {
                                              var ebpGroupingExtFlag = adaptData[offset] >> 7;
                                              console.log('ATF EBP Grouping Ext Flag: ' + ebpGroupingExtFlag);
                                              var ebpGroupingID = adaptData[offset++] & 0x7f;
                                              console.log('ATF EBP Grouping ID: ' + ebpGroupingID);
                                              while (ebpGroupingExtFlag) {
                                                    var ebpGroupingExtFlag = adaptData[offset] >> 7;
                                                    console.log('ATF EBP Grouping Ext Flag: ' + ebpGroupingExtFlag);
                                                    var ebpGroupingID = adaptData[offset++] & 0x7f;
                                                    console.log('ATF EBP Grouping ID: ' + ebpGroupingID);
                                              }
                                        }
                                        if (ebpTimeFlag) {
                                              var ebpAcquisitionTime = this.intFromBytes(adaptData, offset, 8);
                                              console.log('ATF EBP Acquisition Time: ' + ebpAcquisitionTime);
                                              offset += 8;
                                        }
                                        if (ebpExtFlag && ebpExtPartitionFlag) {
                                              var ebpExtensionPartitions = adaptData[offset++];
                                              console.log('ATF EBP Extension Partitions: ' + ebpExtensionPartitions);
                                        }
                                  } else {
                                        offset += (dataLength - 4);
                                  }
                            } else {
                                  offset += (dataLength);
                            }
                            dataParsed += (dataLength + 2);
                      }
                }
                if (adaptationFieldExtFlags) {
                      var adaptationFieldExtLength = adaptData[offset++];
                      console.log('ATF Adaptation Field Ext Length: ' + adaptationFieldExtLength);
                      var ltwFlag = adaptData[offset] >> 7;
                      console.log('ATF ltw Flag: ' + ltwFlag);
                      var piecewiseRateFlag = (adaptData[offset] & 0x40) >> 6;
                      console.log('ATF Piecewise Rate Flag: ' + piecewiseRateFlag);
                      var seamlessSpliceFlag = (adaptData[offset++] & 0x20) >> 5;
                      console.log('ATF Seamless Splice Flag: ' + seamlessSpliceFlag);
                      if (ltwFlag) {
                            var ltwValidFlag = this.intFromBytes(adaptData, offset, 2) >> 15;
                            console.log('ATF ltw Valid Flag: ' + ltwValidFlag);
                            var ltwOffset = this.intFromBytes(adaptData, offset, 2) & 0x7fff;
                            console.log('ATF ltw Offset: ' + ltwOffset);
                            offset += 2;
                      }
                      if (piecewiseRateFlag) {
                            var piecewiseRate = this.intFromBytes(adaptData, offset, 3) & 0x3fffff;
                            console.log('ATF Piecewise Rate: ' + piecewiseRate);
                            offset += 3;
                      }
                }
          }
    }
}
