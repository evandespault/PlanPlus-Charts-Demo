#  Copyright 1999-2012 ImageMagick Studio LLC, a non-profit organization
#  dedicated to making software imaging solutions freely available.
#
#  You may not use this file except in compliance with the License.  You may
#  obtain a copy of the License at
#
#    http://www.imagemagick.org/script/license.php
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#
#  Makefile for building the MagickCore API.
# 

magickincdir = $(INCLUDE_PATH)/magick

# Headers which are installed
magickinc_HEADERS = \
	$(MAGICK_INCLUDE_HDRS)

MAGICK_BIN_SCRPTS = \
  magick/Magick-config \
  magick/MagickCore-config

MAGICK_PKGCONFIG = \
  magick/ImageMagick.pc \
  magick/MagickCore.pc

OSX_GCOV_LDFLAG = @OSX_GCOV_LDFLAG@

MAGICK_MANS = \
  magick/Magick-config.1 \
  magick/MagickCore-config.1

MAGICKCORE_LIBS = magick/libMagickCore.la

if WITH_MODULES
magick_libMagickCore_la_SOURCES = $(MAGICK_BASE_SRCS) $(MAGICK_PLATFORM_SRCS)
magick_libMagickCore_la_LIBADD = $(MAGICK_DEP_LIBS) $(MAGICK_LIBLTDL)
else
magick_libMagickCore_la_SOURCES = $(MAGICK_BASE_SRCS) $(MAGICK_PLATFORM_SRCS) $(MAGICK_CODER_SRCS) $(MAGICK_FILTER_SRCS)
magick_libMagickCore_la_LIBADD = $(MAGICK_DEP_LIBS) $(MAGICK_LIBLTDL)
endif # WITH_MODULES
magick_libMagickCore_la_CPPFLAGS = -I$(top_builddir)/ltdl -I$(top_srcdir)/ltdl $(LIBRARY_EXTRA_CPPFLAGS)
magick_libMagickCore_la_LDFLAGS = -no-undefined -export-symbols-regex ".*" \
  $(OSX_GCOV_LDFLAG) -version-info \
  $(MAGICK_LIBRARY_CURRENT):$(MAGICK_LIBRARY_REVISION):$(MAGICK_LIBRARY_AGE)
magick_libMagickCore_la_DEPENDENCIES = $(MAGICK_LTDLDEPS)

# Library base sources
MAGICK_BASE_SRCS = \
	magick/ImageMagick.h \
	magick/MagickCore.h \
	magick/accelerate.c \
	magick/accelerate.h \
	magick/animate.c \
	magick/animate.h \
	magick/animate-private.h \
	magick/annotate.c \
	magick/annotate.h \
	magick/api.h \
	magick/artifact.c \
	magick/artifact.h \
	magick/attribute.c \
	magick/attribute.h \
	magick/blob.c \
	magick/blob.h \
	magick/blob-private.h \
	magick/cache.c \
	magick/cache.h \
	magick/cache-private.h \
	magick/cache-view.c \
	magick/cache-view.h \
	magick/cipher.c \
	magick/cipher.h \
	magick/client.c \
	magick/client.h \
	magick/coder.c \
	magick/coder.h \
	magick/color.c \
	magick/color.h \
	magick/color-private.h \
	magick/colormap.c \
	magick/colormap.h \
	magick/colormap-private.h \
	magick/colorspace.c \
	magick/colorspace.h \
	magick/colorspace-private.h \
	magick/compare.c \
	magick/compare.h \
	magick/composite.c \
	magick/composite.h \
	magick/composite-private.h \
	magick/compress.c \
	magick/compress.h \
	magick/configure.c \
	magick/configure.h \
	magick/constitute.c \
	magick/constitute.h \
	magick/decorate.c \
	magick/decorate.h \
	magick/delegate.c \
	magick/delegate.h \
	magick/delegate-private.h \
	magick/deprecate.c \
	magick/deprecate.h \
	magick/display.c \
	magick/display.h \
	magick/display-private.h \
	magick/distort.c \
	magick/distort.h \
	magick/draw.c \
	magick/draw.h \
	magick/draw-private.h \
	magick/effect.c \
	magick/effect.h \
	magick/enhance.c \
	magick/enhance.h \
	magick/exception.c \
	magick/exception.h \
	magick/exception-private.h \
	magick/feature.c \
	magick/feature.h \
	magick/fourier.c \
	magick/fourier.h \
	magick/fx.c \
	magick/fx.h \
	magick/fx-private.h \
	magick/gem.c \
	magick/gem.h \
	magick/geometry.c \
	magick/geometry.h \
	magick/hashmap.c \
	magick/hashmap.h \
	magick/histogram.c \
	magick/histogram.h \
	magick/identify.c \
	magick/identify.h \
	magick/image.c \
	magick/image.h \
	magick/image-private.h \
	magick/image-view.c \
	magick/image-view.h \
	magick/layer.c \
	magick/layer.h \
	magick/list.c \
	magick/list.h \
	magick/locale.c \
	magick/locale_.h \
	magick/log.c \
	magick/log.h \
	magick/mac.h \
	magick/magic.c \
	magick/magic.h \
	magick/magick.c \
	magick/magick-config.h \
	magick/magick-type.h \
	magick/magick.h \
	magick/matrix.c \
	magick/matrix.h \
	magick/memory.c \
	magick/memory_.h \
	magick/methods.h \
	magick/method-attribute.h \
	magick/mime.c \
	magick/mime.h \
	magick/module.c \
	magick/module.h \
	magick/monitor.c \
	magick/monitor.h \
	magick/monitor-private.h \
	magick/montage.c \
	magick/montage.h \
	magick/morphology.c \
	magick/morphology.h \
	magick/morphology-private.h \
	magick/nt-base.h \
	magick/nt-feature.h \
	magick/option.c \
	magick/option.h \
	magick/paint.c \
	magick/paint.h \
	magick/pixel.c \
	magick/pixel.h \
	magick/pixel-private.h \
	magick/policy.c \
	magick/policy.h \
	magick/PreRvIcccm.c \
	magick/PreRvIcccm.h \
	magick/prepress.c \
	magick/prepress.h \
	magick/property.c \
	magick/property.h \
	magick/profile.c \
	magick/profile.h \
	magick/quantize.c \
	magick/quantize.h \
	magick/quantum.c \
	magick/quantum.h \
	magick/quantum-export.c \
	magick/quantum-import.c \
	magick/quantum-private.h \
	magick/random.c \
	magick/random_.h \
	magick/random-private.h \
	magick/registry.c \
	magick/registry.h \
	magick/resample.c \
	magick/resample.h \
	magick/resample-private.h \
	magick/resize.c \
	magick/resize.h \
	magick/resize-private.h \
	magick/resource.c \
	magick/resource_.h \
	magick/segment.c \
	magick/segment.h \
	magick/semaphore.c \
	magick/semaphore.h \
	magick/semaphore-private.h \
	magick/shear.c \
	magick/shear.h \
	magick/signature.c \
	magick/signature.h \
	magick/signature-private.h \
	magick/splay-tree.c \
	magick/splay-tree.h \
	magick/static.c \
	magick/static.h \
	magick/statistic.c \
	magick/statistic.h \
	magick/stream.c \
	magick/stream.h \
	magick/stream-private.h \
	magick/string.c \
	magick/string_.h \
	magick/string-private.h \
	magick/studio.h \
	magick/thread.c \
	magick/thread_.h \
	magick/thread-private.h \
	magick/timer.c \
	magick/timer.h \
	magick/token.c \
	magick/token.h \
	magick/token-private.h \
	magick/transform.c \
	magick/transform.h \
	magick/threshold.c \
	magick/threshold.h \
	magick/type.c \
	magick/type.h \
	magick/utility.c \
	magick/utility.h \
	magick/utility-private.h \
	magick/version.c \
	magick/version.h \
	magick/vms.h \
	magick/widget.c \
	magick/widget.h \
	magick/xml-tree.c \
	magick/xml-tree.h \
	magick/xwindow.c \
	magick/xwindow.h 

if WIN32_NATIVE_BUILD
MAGICK_PLATFORM_SRCS = \
	magick/nt-base.c \
	magick/nt-base.h \
	magick/nt-feature.c \
	magick/nt-feature.h
else
if CYGWIN_BUILD
MAGICK_PLATFORM_SRCS = \
	magick/nt-feature.c \
	magick/nt-feature.h
else
MAGICK_PLATFORM_SRCS =
endif # if CYGWIN_BUILD
endif # if WIN32_NATIVE_BUILD

MAGICK_INCLUDE_HDRS = \
	magick/ImageMagick.h \
	magick/MagickCore.h \
	magick/PreRvIcccm.h \
	magick/accelerate.h \
	magick/animate.h \
	magick/annotate.h \
	magick/api.h \
	magick/artifact.h \
	magick/attribute.h \
	magick/blob.h \
	magick/cache.h \
	magick/cache-view.h \
	magick/cipher.h \
	magick/client.h \
	magick/coder.h \
	magick/color.h \
	magick/colormap.h \
	magick/colorspace.h \
	magick/compare.h \
	magick/composite.h \
	magick/compress.h \
	magick/configure.h \
	magick/constitute.h \
	magick/decorate.h \
	magick/delegate.h \
	magick/deprecate.h \
	magick/display.h \
	magick/distort.h \
	magick/draw.h \
	magick/effect.h \
	magick/enhance.h \
	magick/exception.h \
	magick/feature.h \
	magick/fourier.h \
	magick/fx.h \
	magick/gem.h \
	magick/geometry.h \
	magick/hashmap.h \
	magick/histogram.h \
	magick/identify.h \
	magick/image.h \
	magick/image-view.h \
	magick/layer.h \
	magick/list.h \
	magick/locale_.h \
	magick/log.h \
	magick/magic.h \
	magick/magick.h \
	magick/magick-config.h \
	magick/magick-type.h \
	magick/matrix.h \
	magick/memory_.h \
	magick/methods.h \
	magick/method-attribute.h \
	magick/mime.h \
	magick/module.h \
	magick/monitor.h \
	magick/montage.h \
	magick/morphology.h \
	magick/option.h \
	magick/paint.h \
	magick/pixel.h \
	magick/policy.h \
	magick/prepress.h \
	magick/profile.h \
	magick/property.h \
	magick/quantize.h \
	magick/quantum.h \
	magick/random_.h \
	magick/registry.h \
	magick/resample.h \
	magick/resize.h \
	magick/resource_.h \
	magick/segment.h \
	magick/semaphore.h \
	magick/shear.h \
	magick/signature.h \
	magick/splay-tree.h \
	magick/statistic.h \
	magick/stream.h \
	magick/string_.h \
	magick/timer.h \
	magick/token.h \
	magick/transform.h \
	magick/threshold.h \
	magick/type.h \
	magick/utility.h \
	magick/version.h \
	magick/widget.h \
	magick/xml-tree.h \
	magick/xwindow.h

MAGICK_NOINST_HDRS = \
	magick/animate-private.h \
	magick/blob-private.h \
	magick/cache-private.h \
	magick/color-private.h \
	magick/colormap-private.h \
	magick/colorspace-private.h \
	magick/composite-private.h \
	magick/delegate-private.h \
	magick/display-private.h \
	magick/draw-private.h \
	magick/exception-private.h \
	magick/fx-private.h \
	magick/image-private.h \
	magick/mac.h \
	magick/mime-private.h \
	magick/monitor-private.h \
	magick/morphology-private.h \
	magick/nt-base.h \
	magick/nt-feature.h \
	magick/pixel-private.h \
	magick/quantum-private.h \
	magick/random-private.h \
	magick/resample-private.h \
	magick/resize-private.h \
	magick/semaphore-private.h \
	magick/signature-private.h \
	magick/static.h \
	magick/stream-private.h \
	magick/string-private.h \
	magick/studio.h \
	magick/thread_.h \
	magick/thread-private.h \
	magick/token-private.h \
	magick/utility-private.h \
	magick/xwindow-private.h \
	magick/vms.h

MAGICK_EXTRA_DIST = \
	magick/Magick-config.in \
	magick/MagickCore-config.in \
	$(MAGICK_MANS) \
	magick/ImageMagick.pc.in \
	magick/MagickCore.pc.in \
	magick/config.h_vms \
	magick/mac.c \
	magick/nt-base.c \
	magick/nt-feature.c \
	magick/vms.c \
	magick/xwdfile.h_vms 

# Install magick-config.h
MAGICK_INSTALL_DATA_LOCAL_TARGETS = magick-install-data-local
magick-install-data-local:
	$(mkinstalldirs) $(DESTDIR)$(magickincdir)
	$(INSTALL_HEADER) magick/magick-config.h $(DESTDIR)$(magickincdir)/magick-config.h

# Uninstall magick-config.h
MAGICK_UNINSTALL_LOCAL_TARGETS = magick-uninstall-local
magick-uninstall-local:
	rm -f $(DESTDIR)$(magickincdir)/magick-config.h

