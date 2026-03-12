/*
 *
 *  * Copyright (c) 2026
 *  * Author: Mariela Paola Gutierrez
 *  * Repository: https://github.com/mariegutiz
 *  *
 *  * Licensed under the MIT License. You may obtain a copy of the License at:
 *  *     https://opensource.org/licenses/MIT
 *  *
 *  *
 *  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 *
 *
 */

package com.retailops.inventorysimulator.util.pdf;

import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

/**
 * Utility class for handling SVG image conversions.
 *
 * <p>Currently provides a method to convert an SVG string into a PNG image
 * and return it as a Base64-encoded string. The output PNG dimensions can be
 * customized via width and height parameters.</p>
 */
public class SvgUtils {

    public static String svgToBase64Png(String svg, float width, float height) throws Exception {
        TranscoderInput input = new TranscoderInput(new java.io.StringReader(svg));
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        TranscoderOutput output = new TranscoderOutput(baos);

        PNGTranscoder transcoder = new PNGTranscoder();
        transcoder.addTranscodingHint(PNGTranscoder.KEY_WIDTH, width);
        transcoder.addTranscodingHint(PNGTranscoder.KEY_HEIGHT, height);
        transcoder.transcode(input, output);

        byte[] pngBytes = baos.toByteArray();
        return Base64.getEncoder().encodeToString(pngBytes);
    }

}