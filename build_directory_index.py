""" Build index from directory listing

build_directory_index.py </path/to/directory> </base/url> [--header <header text>]
"""

from __future__ import print_function
import os.path, time
import os
import stat
import os
import argparse

PART1  = r"""
<html>
<head>
<title>${header}</title>
<meta name="description" content="${header}"/>

</head>
<body>
    <h2>Index of ${header}</h2>
    <p>

    <table >
        <tbody>
            <tr>
                <th style="text-align: left; padding-left: 10px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                <th style="text-align: left; padding-left: 10px;">Name</th>
                <th style="text-align: left; padding-left: 10px;">Size</th>
                <th style="text-align: left; padding-left: 10px;">Last modified</th>
            </tr>
            <tr>
                <th colspan="4"><hr></th>
            </tr>
            <tr>
                <td valign="top"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmlJREFUeNpsU0toU0EUPfPysx/tTxuDH9SCWhUDooIbd7oRUUTMouqi2iIoCO6lceHWhegy4EJFinWjrlQUpVm0IIoFpVDEIthm0dpikpf3ZuZ6Z94nrXhhMjM3c8895977BBHB2PznK8WPtDgyWH5q77cPH8PpdXuhpQT4ifR9u5sfJb1bmw6VivahATDrxcRZ2njfoaMv+2j7mLDn93MPiNRMvGbL18L9IpF8h9/TN+EYkMffSiOXJ5+hkD+PdqcLpICWHOHc2CC+LEyA/K+cKQMnlQHJX8wqYG3MAJy88Wa4OLDvEqAEOpJd0LxHIMdHBziowSwVlF8D6QaicK01krw/JynwcKoEwZczewroTvZirlKJs5CqQ5CG8pb57FnJUA0LYCXMX5fibd+p8LWDDemcPZbzQyjvH+Ki1TlIciElA7ghwLKV4kRZstt2sANWRjYTAGzuP2hXZFpJ/GsxgGJ0ox1aoFWsDXyyxqCs26+ydmagFN/rRjymJ1898bzGzmQE0HCZpmk5A0RFIv8Pn0WYPsiu6t/Rsj6PauVTwffTSzGAGZhUG2F06hEc9ibS7OPMNp6ErYFlKavo7MkhmTqCxZ/jwzGA9Hx82H2BZSw1NTN9Gx8ycHkajU/7M+jInsDC7DiaEmo1bNl1AMr9ASFgqVu9MCTIzoGUimXVAnnaN0PdBBDCCYbEtMk6wkpQwIG0sn0PQIUF4GsTwLSIFKNqF6DVrQq+IWVrQDxAYQC/1SsYOI4pOxKZrfifiUSbDUisif7XlpGIPufXd/uvdvZm760M0no1FZcnrzUdjw7au3vu/BVgAFLXeuTxhTXVAAAAAElFTkSuQmCC "
                    alt="[PARENTDIR]"></td>
                <td style="padding-left: 10px;"><a href="../">Parent Directory</a></td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <th colspan="4"><hr></th>
            </tr>

"""

PART2 = r"""
        </tbody>
    </table>
    </p>
</body>
</html>
"""

EXCLUDED = ['index.html']


def fun(dir,root_dir,base):
    print('Processing: '+dir)
    file_names = [fname for fname in sorted(os.listdir(dir))
              if fname not in EXCLUDED and os.path.isfile(dir+fname)]
    dir_names = [fname for fname in sorted(os.listdir(dir))
                if fname not in EXCLUDED  ]
    dir_names = [fname for fname in dir_names if fname not in file_names]

    html = PART1.replace("${header}", dir)


    for sub_dir in dir_names:
        dir_row = r"""
            <tr>
                <td valign="top"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAd5JREFUeNqMU79rFUEQ/vbuodFEEkzAImBpkUabFP4ldpaJhZXYm/RiZWsv/hkWFglBUyTIgyAIIfgIRjHv3r39MePM7N3LcbxAFvZ2b2bn22/mm3XMjF+HL3YW7q28YSIw8mBKoBihhhgCsoORot9d3/ywg3YowMXwNde/PzGnk2vn6PitrT+/PGeNaecg4+qNY3D43vy16A5wDDd4Aqg/ngmrjl/GoN0U5V1QquHQG3q+TPDVhVwyBffcmQGJmSVfyZk7R3SngI4JKfwDJ2+05zIg8gbiereTZRHhJ5KCMOwDFLjhoBTn2g0ghagfKeIYJDPFyibJVBtTREwq60SpYvh5++PpwatHsxSm9QRLSQpEVSd7/TYJUb49TX7gztpjjEffnoVw66+Ytovs14Yp7HaKmUXeX9rKUoMoLNW3srqI5fWn8JejrVkK0QcrkFLOgS39yoKUQe292WJ1guUHG8K2o8K00oO1BTvXoW4yasclUTgZYJY9aFNfAThX5CZRmczAV52oAPoupHhWRIUUAOoyUIlYVaAa/VbLbyiZUiyFbjQFNwiZQSGl4IDy9sO5Wrty0QLKhdZPxmgGcDo8ejn+c/6eiK9poz15Kw7Dr/vN/z6W7q++091/AQYA5mZ8GYJ9K0AAAAAASUVORK5CYII= "
                                    alt="[DIR]"></td>
        """
        dir_row += str("<td style=\"padding-left: 10px;\"><a href=\"${name}\">${name}</a></td>").replace("${name}", sub_dir)
        dir_row += "<td>&nbsp;</td>"
        dir_row += "<td>&nbsp;</td>"
        dir_row += "</tr>"
        html += dir_row


    for file in file_names:
        file_stats = os.stat(os.path.join(dir, file))
        file_row = r"""
            <tr>
                <td valign="top"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABnRSTlMAAAAAAABupgeRAAABHUlEQVR42o2RMW7DIBiF3498iHRJD5JKHurL+CRVBp+i2T16tTynF2gO0KSb5ZrBBl4HHDBuK/WXACH4eO9/CAAAbdvijzLGNE1TVZXfZuHg6XCAQESAZXbOKaXO57eiKG6ft9PrKQIkCQqFoIiQFBGlFIB5nvM8t9aOX2Nd18oDzjnPgCDpn/BH4zh2XZdlWVmWiUK4IgCBoFMUz9eP6zRN75cLgEQhcmTQIbl72O0f9865qLAAsURAAgKBJKEtgLXWvyjLuFsThCSstb8rBCaAQhDYWgIZ7myM+TUBjDHrHlZcbMYYk34cN0YSLcgS+wL0fe9TXDMbY33fR2AYBvyQ8L0Gk8MwREBrTfKe4TpTzwhArXWi8HI84h/1DfwI5mhxJamFAAAAAElFTkSuQmCC "
                                    alt="[DIR]"></td>
            """
        file_size = file_stats[stat.ST_SIZE]
        link = file if file_size < 40*1024*1024 else base + os.path.join(dir, file)[1:]
        if file_size > 1024*1024*1024:
            file_size = "%.2fG" % (file_size / float(1024*1024*1024))
        elif file_size > 1024*1024:
            file_size = "%.2fM" % (file_size / float(1024*1024))
        elif file_size > 1024:
            file_size = "%.2fK" % (file_size / float(1024))
        else:
            file_size =  "%.0fB" % (file_size)
        file_row += "<td style=\"padding-left: 10px;\"><a href=\"%s\">%s</a></td>" % (link, file)
        file_row += "<td style=\"padding-left: 10px;\">%s</td>" % (file_size)
        file_row += "<td style=\"padding-left: 10px;\">%s</td>" % (time.ctime ( file_stats [ stat.ST_MTIME ] ))
        file_row += "</tr>"

        html += file_row

    html += PART2

    f = open(dir+'/index.html','w')
    print(html,file=f)
    f.close()
    for sub_dir in dir_names:
        try:
            fun(dir+sub_dir+"/",root_dir+'../',base)
        except:
            pass

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("directory")
    parser.add_argument("base")
    parser.add_argument("--header")
    args = parser.parse_args()
    fun(args.directory+'/','../', args.base)

if __name__ == '__main__':
    main()