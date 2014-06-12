package analyze.filter;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.io.StringWriter;

import analyze.DockingAnalyzer;
import analyze.attribute.AttributeDataType;

public class ImageToByteFilter extends DockingFilter{

	public ImageToByteFilter(DockingAnalyzer da) {
		super(da);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		this.imageToStream();
	}

	public void imageToStream() throws IOException
	{
		byte[] buf = new byte[2048];

		String filePath = this.getStream().getAttrSet().get(AttributeDataType.FILE_BYTE_DATA);

		File imgFile = new File(filePath);

		String flen = String.valueOf(imgFile.length());

		InputStream fis = new FileInputStream(imgFile);
		
		StringWriter sw = null;
		Reader in = null;

		File file = new File("c:\\zipTest\\img\\src.png");
		file.createNewFile();
		OutputStream os = new FileOutputStream(file);

		while(fis.available() > 0)
		{
			int read = fis.read(buf);
			System.out.println("read : " + buf);
			os.write(buf,0,read);
		}

		fis.close();
		/*OutputStream os = csock.getOutputStream();
			// send header
			os.write(header.getBytes());
			// send body
			while (fis.available() > 0) {
				int readsz = fis.read(buffer);
				os.write(buffer, 0, readsz);
			}
			os.close();
			fis.close();*/
	}
}